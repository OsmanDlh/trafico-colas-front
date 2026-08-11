import type { EChartsOption } from 'echarts'

import { baseTextStyle, CHART_COLORS, tooltipStyle } from '@/lib/chart-theme'
import type { CostRow, ScenarioResult } from '@/types/queue.type'

const costSweepOption = (table: CostRow[], best: CostRow): EChartsOption => {
  const labels = table.map((row) => (row.k == null ? `${row.s}` : `${row.s}/${row.k}`))
  const bestIndex = table.findIndex((row) => row.s === best.s && row.k === best.k)
  const colors = table.map((row) =>
    row.s === best.s && row.k === best.k ? CHART_COLORS.secondary : CHART_COLORS.primary,
  )

  return {
    title: {
      text: 'Costo total según tamaño del equipo',
      left: 'center',
      textStyle: { ...baseTextStyle, fontSize: 13, fontWeight: 600 },
    },
    tooltip: { ...tooltipStyle, trigger: 'axis' },
    grid: { left: 52, right: 16, top: 48, bottom: 40 },
    xAxis: {
      type: 'category',
      data: labels,
      name: 'Personas',
      nameTextStyle: { color: CHART_COLORS.muted },
      axisLabel: { color: CHART_COLORS.muted },
      axisLine: { lineStyle: { color: CHART_COLORS.border } },
    },
    yAxis: {
      type: 'value',
      name: 'Costo',
      nameTextStyle: { color: CHART_COLORS.muted },
      axisLabel: { color: CHART_COLORS.muted },
      splitLine: { lineStyle: { color: CHART_COLORS.soft } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        name: 'Costo total',
        data: table.map((row, index) => ({
          value: Number(row.total_cost.toFixed(2)),
          itemStyle: { color: colors[index] },
          symbolSize: index === bestIndex ? 14 : 8,
        })),
        lineStyle: { width: 3, color: CHART_COLORS.primary },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(46, 53, 78, 0.25)' },
              { offset: 1, color: 'rgba(46, 53, 78, 0.02)' },
            ],
          },
        },
        markPoint:
          bestIndex >= 0
            ? {
                data: [
                  {
                    name: 'Mejor',
                    coord: [bestIndex, Number(best.total_cost.toFixed(2))],
                    itemStyle: { color: CHART_COLORS.secondary },
                    label: {
                      formatter: 'Mejor',
                      color: CHART_COLORS.primary,
                      fontWeight: 700,
                    },
                  },
                ],
              }
            : undefined,
      },
    ],
  }
}

const costBreakdownOption = (best: CostRow): EChartsOption => ({
  title: {
    text: '¿De qué se compone el costo?',
    left: 'center',
    textStyle: { ...baseTextStyle, fontSize: 13, fontWeight: 600 },
  },
  tooltip: {
    ...tooltipStyle,
    trigger: 'item',
    formatter: '{b}: <b>{c}</b> ({d}%)',
  },
  legend: {
    bottom: 0,
    textStyle: { color: CHART_COLORS.muted, fontSize: 11 },
  },
  series: [
    {
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '48%'],
      label: { color: CHART_COLORS.primary, fontSize: 11 },
      data: [
        {
          name: 'Personal',
          value: Number(best.service_cost.toFixed(2)),
          itemStyle: { color: CHART_COLORS.primary },
        },
        {
          name: 'Espera',
          value: Number(best.waiting_cost.toFixed(2)),
          itemStyle: { color: CHART_COLORS.secondary },
        },
        {
          name: 'Clientes perdidos',
          value: Number(best.blocking_cost.toFixed(2)),
          itemStyle: { color: CHART_COLORS.warning },
        },
      ].filter((item) => item.value > 0),
    },
  ],
})

const compareScenariosOption = (results: ScenarioResult[]): EChartsOption => {
  const names = results.map((item) => item.name)
  const getMetric = (item: ScenarioResult, key: 'Wq' | 'L' | 'rho') => {
    if (!item.metrics) return 0
    const value = item.metrics[key]
    if (value == null) return 0
    return key === 'rho' ? Number((value * 100).toFixed(2)) : Number(value.toFixed(3))
  }

  return {
    title: {
      text: 'Comparación lado a lado',
      left: 'center',
      textStyle: { ...baseTextStyle, fontSize: 13, fontWeight: 600 },
    },
    tooltip: { ...tooltipStyle, trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: CHART_COLORS.muted, fontSize: 11 },
    },
    grid: { left: 48, right: 16, top: 48, bottom: 48 },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: { color: CHART_COLORS.muted, interval: 0 },
      axisLine: { lineStyle: { color: CHART_COLORS.border } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: CHART_COLORS.muted },
      splitLine: { lineStyle: { color: CHART_COLORS.soft } },
    },
    series: [
      {
        name: 'Espera en cola',
        type: 'bar',
        data: results.map((item) => getMetric(item, 'Wq')),
        itemStyle: { color: CHART_COLORS.primary, borderRadius: [6, 6, 0, 0] },
      },
      {
        name: 'Gente en sistema',
        type: 'bar',
        data: results.map((item) => getMetric(item, 'L')),
        itemStyle: { color: CHART_COLORS.secondary, borderRadius: [6, 6, 0, 0] },
      },
      {
        name: 'Ocupación %',
        type: 'bar',
        data: results.map((item) => getMetric(item, 'rho')),
        itemStyle: { color: CHART_COLORS.warning, borderRadius: [6, 6, 0, 0] },
      },
    ],
  }
}

const capacityAlternativesOption = (
  alternatives: Array<{ s: number; k: number | null; Wq: number; rho: number }>,
): EChartsOption => ({
  title: {
    text: 'Opciones válidas de equipo',
    left: 'center',
    textStyle: { ...baseTextStyle, fontSize: 13, fontWeight: 600 },
  },
  tooltip: { ...tooltipStyle, trigger: 'axis' },
  legend: {
    bottom: 0,
    textStyle: { color: CHART_COLORS.muted, fontSize: 11 },
  },
  grid: { left: 48, right: 16, top: 48, bottom: 40 },
  xAxis: {
    type: 'category',
    data: alternatives.map((row) => (row.k == null ? `${row.s}` : `${row.s} / cupo ${row.k}`)),
    axisLabel: { color: CHART_COLORS.muted, hideOverlap: true },
    axisLine: { lineStyle: { color: CHART_COLORS.border } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: CHART_COLORS.muted },
    splitLine: { lineStyle: { color: CHART_COLORS.soft } },
  },
  series: [
    {
      name: 'Espera (Wq)',
      type: 'bar',
      data: alternatives.map((row) => Number(row.Wq.toFixed(4))),
      itemStyle: { color: CHART_COLORS.primary, borderRadius: [6, 6, 0, 0] },
    },
    {
      name: 'Ocupación %',
      type: 'line',
      data: alternatives.map((row) => Number((row.rho * 100).toFixed(1))),
      itemStyle: { color: CHART_COLORS.warning },
      lineStyle: { width: 3 },
    },
  ],
})

export { capacityAlternativesOption, compareScenariosOption, costBreakdownOption, costSweepOption }
