const required = (value: string | undefined, name: string) => value?.trim() || `__MISSING_${name}__`;

const supabaseUrl = required(process.env.EXPO_PUBLIC_SUPABASE_URL, 'SUPABASE_URL');
const explicitApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const CONFIG = {
  supabaseUrl,
  supabasePublishableKey: required(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY, 'SUPABASE_PUBLISHABLE_KEY'),
  apiUrl: explicitApiUrl || (supabaseUrl.startsWith('http') ? `${supabaseUrl}/functions/v1/workit-api` : '__MISSING_API_URL__'),
};

export const CONFIG_READY = !Object.values(CONFIG).some(v => v.startsWith('__MISSING_'));
