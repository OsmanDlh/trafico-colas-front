import type { EChartsOption } from 'echarts'

import { baseTextStyle, CHART_COLORS, tooltipStyle } from '@/lib/chart-theme'
import type { Metrics } from '@/types/queue.type'
import type { MetricsLike } from '@/utils/queue-metrics'

const utilizationGaugeOption = (rho: number, title = 'Ocupación del equipo'): EChartsOption => {
  const percent = Math.min(Math.max(rho, 0), 1.2) * 100
  return {
    title: {
      text: title,
      left: 'center',
      top: 8,
      textStyle: { ...baseTextStyle, fontSize: 13, fontWeight: 600 },
    },
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        center: ['50%', '62%'],
        radius: '90%',
        axisLine: {
          lineStyle: {
            width: 18,
            color: [
              [0.7, CHART_COLORS.success],
              [0.9, CHART_COLORS.warning],
              [1, CHART_COLORS.danger],
            ],
          },
        },
        pointer: {
          itemStyle: { color: CHART_COLORS.primary },
          width: 5,
          length: '60%',
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: CHART_COLORS.muted, distance: 14, fontSize: 10 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: CHART_COLORS.primary,
          fontSize: 22,
          fontWeight: 700,
          offsetCenter: [0, '28%'],
        },
        data: [{ value: Number(percent.toFixed(1)) }],
      },
    ],
  }
}

const pnDistributionOption = (pn: number[]): EChartsOption => ({
  title: {
    text: '¿Cuántos clientes hay normalmente?',
    left: 'center',
    textStyle: { ...baseTextStyle, fontSize: 13, fontWeight: 600 },
  },
  tooltip: { ...tooltipStyle, trigger: 'axis' },
  grid: { left: 40, right: 16, top: 48, bottom: 36 },
  xAxis: {
    type: 'category',
    data: pn.map((_, index) => String(index)),
    name: 'Clientes',
    nameTextStyle: { color: CHART_COLORS.muted },
    axisLabel: { color: CHART_COLORS.muted },
    axisLine: { lineStyle: { color: CHART_COLORS.border } },
  },
  yAxis: {
    type: 'value',
    name: '%',
    nameTextStyle: { color: CHART_COLORS.muted },
    axisLabel: { color: CHART_COLORS.muted },
    splitLine: { lineStyle: { color: CHART_COLORS.soft } },
  },
  series: [
    {
      type: 'bar',
      name: 'Probabilidad',
      data: pn.map((value) => Number((value * 100).toFixed(2))),
      itemStyle: { color: CHART_COLORS.primary, borderRadius: [6, 6, 0, 0] },
      emphasis: { itemStyle: { color: CHART_COLORS.secondary } },
    },
  ],
})

const waitMetricsOption = (metrics: Metrics | MetricsLike): EChartsOption => ({
  title: {
    text: 'Espera y gente en el sistema',
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
    data: ['En el sistema', 'Solo en cola'],
    axisLabel: { color: CHART_COLORS.muted },
    axisLine: { lineStyle: { color: CHART_COLORS.border } },
  },
  yAxis: [
    {
      type: 'value',
      name: 'Personas',
      nameTextStyle: { color: CHART_COLORS.muted, fontSize: 10 },
      axisLabel: { color: CHART_COLORS.muted },
      splitLine: { lineStyle: { color: CHART_COLORS.soft } },
    },
    {
      type: 'value',
      name: 'Tiempo',
      nameTextStyle: { color: CHART_COLORS.muted, fontSize: 10 },
      axisLabel: { color: CHART_COLORS.muted },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: 'Personas (L / Lq)',
      type: 'bar',
      data: [Number(metrics.L.toFixed(3)), Number(metrics.Lq.toFixed(3))],
      itemStyle: { color: CHART_COLORS.primary, borderRadius: [6, 6, 0, 0] },
      barWidth: 28,
    },
    {
      name: 'Tiempo (W / Wq)',
      type: 'line',
      yAxisIndex: 1,
      data: [Number(metrics.W.toFixed(4)), Number(metrics.Wq.toFixed(4))],
      itemStyle: { color: CHART_COLORS.warning },
      lineStyle: { width: 3, color: CHART_COLORS.warning },
      symbolSize: 10,
    },
  ],
})

export { pnDistributionOption, utilizationGaugeOption, waitMetricsOption }
