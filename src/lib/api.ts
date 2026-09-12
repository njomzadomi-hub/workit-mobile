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

export const getMarket = (params: { type?: string; country?: string; q?: string; cursor?: string } = {}) => {
  const qs = Object.entries(params).filter(([,v]) => v).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
  return api(`/market${qs ? `?${qs}` : ''}`);
};
export const getMarketItem = (id: string) => api(`/market/${id}`);
export const createMarketItem = (payload: any) => api('/market', { method: 'POST', body: JSON.stringify(payload) });
export const createOrder = (marketItemId: string, payload: any = {}) => api('/orders', { method: 'POST', body: JSON.stringify({ market_item_id: marketItemId, ...payload }) });
export const getMyOrders = () => api('/orders/mine');
export const setOrderStatus = (id: string, status: string) => api(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const getProfileReviews = (profileId: string) => api(`/reviews/profile/${profileId}`);
export const createReview = (payload: any) => api('/reviews', { method: 'POST', body: JSON.stringify(payload) });
