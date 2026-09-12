export const C = {
  bg: '#050505',
  panel: '#0D0D0F',
  panel2: '#141417',
  line: '#242428',
  text: '#F7F7F8',
  muted: '#8A8A93',
  faint: '#5C5C64',
  blue: '#5B7CFF',
  blue2: '#7E96FF',
  green: '#38D996',
  amber: '#FFB648',
  red: '#FF5D6C',
  white: '#FFFFFF',
};

export const R = { sm: 10, md: 16, lg: 24, pill: 999 };
export const S = { pageX: 18, navH: 72 };

export const postMeta: Record<string, { label: string; accent: string; cta: string }> = {
  video: { label: 'SHOW WORK', accent: C.blue2, cta: 'View profile' },
  hire_me: { label: 'HIRE ME', accent: C.green, cta: 'Hire now' },
  service: { label: 'SERVICE', accent: C.blue, cta: 'Book service' },
  product: { label: 'PRODUCT', accent: C.amber, cta: 'Buy now' },
  job: { label: 'JOB', accent: C.green, cta: 'Apply now' },
  pitch: { label: 'PITCH', accent: C.blue2, cta: 'Back this' },
  teach: { label: 'TEACH', accent: C.amber, cta: 'Learn now' },
  donate: { label: 'DONATE', accent: C.red, cta: 'Donate' },
};
