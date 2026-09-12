const required = (value: string | undefined, name: string) => value?.trim() || `__MISSING_${name}__`;

export const CONFIG = {
  supabaseUrl: required(process.env.EXPO_PUBLIC_SUPABASE_URL, 'SUPABASE_URL'),
  supabasePublishableKey: required(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY, 'SUPABASE_PUBLISHABLE_KEY'),
  apiUrl: required(process.env.EXPO_PUBLIC_API_URL, 'API_URL'),
};

export const CONFIG_READY = !Object.values(CONFIG).some(v => v.startsWith('__MISSING_'));
