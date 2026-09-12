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
export const getComments  = (id: string, cursor?: string) => api(`/posts/${id}/comments${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`);
export const addComment   = (id: string, body: string) => api(`/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ body }) });
export const getMe        = () => api('/profiles/me');
export const getProfile   = (username: string) => api(`/profiles/${encodeURIComponent(username)}`);
export const getUploadUrl = () => api('/videos/upload-url', { method: 'POST' });

export const searchTalent = (params: { query?: string; profession?: string; skill?: string; location?: string; country?: string; available?: boolean; limit?: number } = {}) => {
  const qs = Object.entries(params).filter(([,v]) => v !== undefined && v !== '' && v !== false).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
  return api(`/profiles/search${qs ? `?${qs}` : ''}`);
};

export const getJobs = (params: { remote?: boolean; job_type?: string; country?: string; cursor?: string; limit?: number } = {}) => {
  const qs = Object.entries(params).filter(([,v]) => v !== undefined && v !== '' && v !== false).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
  return api(`/jobs${qs ? `?${qs}` : ''}`);
};
export const getJob = (jobId: string) => api(`/jobs/${jobId}`);
export const createJob = (payload: any) => api('/jobs', { method: 'POST', body: JSON.stringify(payload) });
export const getMyJobs = () => api('/jobs/mine');
export const applyToJob = (jobId: string, payload: any = {}) => api(`/jobs/${jobId}/apply`, { method: 'POST', body: JSON.stringify(payload) });
export const getMyApplications = () => api('/applications/mine');
export const getJobApplications = (jobId: string) => api(`/jobs/${jobId}/applications`);
export const setApplicationStatus = (applicationId: string, status: string) => api(`/applications/${applicationId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

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
export const getRevenuePlans = () => api('/revenue/plans');
export const getEarnings = () => api('/revenue/earnings');
export const submitReport = (payload: any) => api('/reports', { method: 'POST', body: JSON.stringify(payload) });

export const getConversations = () => api('/messages/conversations');
export const openConversation = (otherId: string) => api(`/messages/open/${otherId}`, { method: 'POST' });
export const getMessages = (conversationId: string, cursor?: string) => api(`/messages/${conversationId}${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`);
export const sendMessage = (conversationId: string, body: string) => api(`/messages/${conversationId}`, { method: 'POST', body: JSON.stringify({ body }) });

export const getNotifications = () => api('/notifications');
export const markAllNotificationsRead = () => api('/notifications/read-all', { method: 'POST' });
