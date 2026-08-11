const CHART_COLORS = {
  primary: '#2E354E',
  secondary: '#FCE03A',
  muted: '#5C647A',
  border: '#D5D9E4',
  success: '#1B7F4E',
  warning: '#C9A227',
  danger: '#C62828',
  soft: '#E8EAF0',
  white: '#FFFFFF',
} as const

const baseTextStyle = {
  color: CHART_COLORS.primary,
  fontFamily: 'Manrope, sans-serif',
}

const tooltipStyle = {
  backgroundColor: CHART_COLORS.white,
  borderColor: CHART_COLORS.border,
  textStyle: { color: CHART_COLORS.primary, fontSize: 12 },
}

export { baseTextStyle, CHART_COLORS, tooltipStyle }
