export const PASSWORD_RESET_REDIRECT = 'workit://reset-password';

export type RecoveryLink =
  | { kind: 'ignore' }
  | { kind: 'invalid' }
  | { kind: 'session'; access_token: string; refresh_token: string };

// Never log recovery URLs or tokens. Only this callback may enter password recovery.
export function parseRecoveryLink(raw: string): RecoveryLink {
  let url: URL;
  try { url = new URL(raw); } catch { return { kind: 'ignore' }; }
  if (url.protocol !== 'workit:' || url.hostname !== 'reset-password') return { kind: 'ignore' };
  if (url.username || url.password || url.port || (url.pathname && url.pathname !== '/')) return { kind: 'invalid' };
  const query = new URLSearchParams(url.search);
  const fragment = new URLSearchParams(url.hash.slice(1));
  const value = (key: string) => {
    const all = [...query.getAll(key), ...fragment.getAll(key)];
    return all.length === 1 ? all[0] : null;
  };
  if (query.has('error') || query.has('error_code') || fragment.has('error') || fragment.has('error_code')) return { kind: 'invalid' };
  const access_token = value('access_token');
  const refresh_token = value('refresh_token');
  if (value('type') !== 'recovery' || !access_token?.trim() || !refresh_token?.trim()) return { kind: 'invalid' };
  return { kind: 'session', access_token, refresh_token };
}

export function validateNewPassword(password: string, confirmation: string) {
  if (password.length < 8) return 'Use at least 8 characters.';
  if (password !== confirmation) return 'Passwords do not match.';
  return '';
}
