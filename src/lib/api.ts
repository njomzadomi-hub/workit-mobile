import { supabase } from './supabase';

import { CONFIG } from './config';
const API = CONFIG.apiUrl;

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  return { Authorization: `Bearer ${data.session?.access_token ?? ''}` };
}

export async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const getFeed      = (cursor?: string) => api(`/posts/feed${cursor ? `?cursor=${cursor}` : ''}`);
export const likePost     = (id: string) => api(`/posts/${id}/like`, { method: 'POST' });
export const getMe        = () => api('/profiles/me');
export const getUploadUrl = () => api('/videos/upload-url', { method: 'POST' });
