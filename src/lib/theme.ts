import { Platform } from 'react-native';

export const C = {
  bg: '#05070A',
  bg2: '#080C12',
  panel: '#0B1119',
  panel2: '#111925',
  panel3: '#151E2B',
  glass: 'rgba(14,20,30,.86)',
  glassStrong: 'rgba(9,14,22,.96)',
  line: '#253142',
  lineSoft: '#172131',
  text: '#F7F8FC',
  muted: '#A9B0C0',
  faint: '#6E7789',
  violet: '#8B5CF6',
  violet2: '#A855F7',
  violet3: '#6D5DFF',
  violetSoft: '#C4B5FD',
  blue: '#4D7CFE',
  blue2: '#78A1FF',
  green: '#47E29A',
  amber: '#F7C76A',
  gold: '#F3C46B',
  gold2: '#FFD98D',
  red: '#FF5678',
  white: '#FFFFFF',
  black: '#030405',
};

export const F = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
};

export const R = { xs: 8, sm: 11, md: 16, lg: 22, xl: 28, pill: 999 };
export const S = { pageX: 18, navH: 78, top: 52 };

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: .42,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 12,
};

export const glow = {
  shadowColor: C.violet2,
  shadowOpacity: .46,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 0 },
  elevation: 10,
};

export const postMeta: Record<string, { label: string; accent: string; cta: string }> = {
  video: { label: 'SHOW WORK', accent: C.violetSoft, cta: 'View profile' },
  hire_me: { label: 'HIRE ME', accent: C.gold, cta: 'Hire now' },
  service: { label: 'SERVICE', accent: C.violet2, cta: 'Book service' },
  product: { label: 'PRODUCT', accent: C.amber, cta: 'Buy now' },
  job: { label: 'JOB', accent: C.blue2, cta: 'Apply now' },
  pitch: { label: 'PITCH', accent: C.violetSoft, cta: 'Back this' },
  teach: { label: 'TEACH', accent: C.green, cta: 'Learn now' },
  donate: { label: 'DONATE', accent: C.red, cta: 'Donate' },
};
