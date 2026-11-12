// studia-colors.ts

export const C = {
  primaryDark: '#3B288C',
  primary: '#5B46B6',
  lavender: '#D6CEFA',
  lavenderSoft: '#ECE8FC',
  white: '#FFFFFF',
  surface: '#F4F5F9',
  border: '#E2E4EC',
  muted: '#6B7280',
  text: '#1F2438',
  green: '#38A169',
  greenTint: '#DFF2E6',
  red: '#E05252',
  orange: '#ED8936',
  blue: '#3B82F6',
  gold: '#F59E0B',
};

/** Splash screen gradient: purple (top) -> white (bottom) */
export const SPLASH_GRADIENT = {
  colors: [
    'rgba(76, 52, 190, 0.88)',
    'rgba(98, 75, 215, 0.92)',
    'rgba(236, 232, 252, 0.97)',
    '#F5F3FF',
  ],
  locations: [0, 0.5, 0.8, 1],
} as const;
