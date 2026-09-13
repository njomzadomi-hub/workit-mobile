import { supabase } from './supabase';
import { CONFIG } from './config';
const API = CONFIG.apiUrl;
const PUBLISH_API = `${CONFIG.supabaseUrl}/functions/v1/workit-publish`;
const SOCIAL_API = `${CONFIG.supabaseUrl}/functions/v1/workit-social`;
const TALENT_API = `${CONFIG.supabaseUrl}/functions/v1/workit-talent`;
const ORG_API = `${CONFIG.supabaseUrl}/functions/v1/workit-org`;

async function authHeader(){const{data}=await supabase.auth.getSession();return{Authorization:`Bearer ${data.session?.access_token??''}`}}
export async function api(path:string,opts:RequestInit={}){const res=await fetch(`${API}${path}`,{...opts,headers:{'Content-Type':'application/json',...(await authHeader()),...(opts.headers||{})}});if(!res.ok)throw new Error(`API ${res.status}`);return res.json()}
async function publishApi(action:string,payload:any={}){const res=await fetch(PUBLISH_API,{method:'POST',headers:{'Content-Type':'application/json',...(await authHeader())},body:JSON.stringify({action,...payload})});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data?.error||`Publish API ${res.status}`);return data}
async function socialApi(path:string,opts:RequestInit={}){const res=await fetch(`${SOCIAL_API}${path}`,{...opts,headers:{'Content-Type':'application/json',...(await authHeader()),...(opts.headers||{})}});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data?.error||`Social API ${res.status}`);return data}
async function talentApi(path:string){const res=await fetch(`${TALENT_API}${path}`,{headers:{'Content-Type':'application/json',...(await authHeader())}});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data?.error||`Talent API ${res.status}`);return data}
async function orgApi(path:string,opts:RequestInit={}){const res=await fetch(`${ORG_API}${path}`,{...opts,headers:{'Content-Type':'application/json',...(await authHeader()),...(opts.headers||{})}});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data?.error||`Organization API ${res.status}`);return data}

export const getFeed=(cursor?:string,mode:'for_you'|'following'='for_you')=>{const q=new URLSearchParams();q.set('mode',mode);if(cursor)q.set('cursor',cursor);return socialApi(`/feed?${q.toString()}`)};
export const getProfilePosts=(profileId:string,cursor?:string)=>socialApi(`/profile/${profileId}/posts${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`);
export const getFollowStatus=(profileId:string)=>socialApi(`/follow/${profileId}`);
export const followProfile=(profileId:string)=>socialApi(`/follow/${profileId}`,{method:'POST'});
export const unfollowProfile=(profileId:string)=>socialApi(`/follow/${profileId}`,{method:'DELETE'});
export const likePost=(id:string)=>api(`/posts/${id}/like`,{method:'POST'});
export const getComments=(id:string,cursor?:string)=>api(`/posts/${id}/comments${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`);
export const addComment=(id:string,body:string)=>api(`/posts/${id}/comments`,{method:'POST',body:JSON.stringify({body})});
export const getMe=()=>api('/profiles/me');
export const updateMe=(payload:any)=>api('/profiles/me',{method:'PATCH',body:JSON.stringify(payload)});
export const getPreferences=()=>api('/profiles/me/preferences');
export const requestAccountDeletion=(reason?:string)=>api('/profiles/me/deletion-request',{method:'POST',body:JSON.stringify({reason})});
export const cancelAccountDeletion=()=>api('/profiles/me/deletion-request',{method:'DELETE'});
export const getProfile=(username:string)=>api(`/profiles/${encodeURIComponent(username)}`);

export const getUploadUrl=(contentType='video/mp4')=>publishApi('upload-url',{content_type:contentType});
export const publishPost=(payload:any)=>publishApi('create-post',payload);
export const publishJob=(payload:any)=>publishApi('create-job',payload);
export const publishMarketItem=(payload:any)=>publishApi('create-market',payload);

export const searchTalent=(params:{query?:string;profession?:string;skill?:string;location?:string;country?:string;available?:boolean;limit?:number}={})=>{const merged={...params,query:params.query||params.skill};const qs=Object.entries(merged).filter(([,v])=>v!==undefined&&v!==''&&v!==false).map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');return talentApi(`/?${qs}`)};
export const getJobs=(params:{remote?:boolean;job_type?:string;country?:string;cursor?:string;limit?:number}={})=>{const qs=Object.entries(params).filter(([,v])=>v!==undefined&&v!==''&&v!==false).map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');return api(`/jobs${qs?`?${qs}`:''}`)};
export const getJob=(jobId:string)=>api(`/jobs/${jobId}`);
export const createJob=(payload:any)=>api('/jobs',{method:'POST',body:JSON.stringify(payload)});
export const getMyJobs=()=>api('/jobs/mine');
export const applyToJob=(jobId:string,payload:any={})=>api(`/jobs/${jobId}/apply`,{method:'POST',body:JSON.stringify(payload)});
export const getMyApplications=()=>api('/applications/mine');
export const getJobApplications=(jobId:string)=>api(`/jobs/${jobId}/applications`);
export const setApplicationStatus=(applicationId:string,status:string)=>api(`/applications/${applicationId}/status`,{method:'PATCH',body:JSON.stringify({status})});

export const getMyOrganizations=()=>orgApi('/mine');
export const createOrganization=(payload:any)=>orgApi('/organizations',{method:'POST',body:JSON.stringify(payload)});
export const getOrganization=(slug:string)=>orgApi(`/organizations/slug/${encodeURIComponent(slug)}`);
export const updateOrganization=(id:string,payload:any)=>orgApi(`/organizations/${id}`,{method:'PATCH',body:JSON.stringify(payload)});

export const getMarket=(params:{type?:string;country?:string;q?:string;cursor?:string}={})=>{const qs=Object.entries(params).filter(([,v])=>v).map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');return api(`/market${qs?`?${qs}`:''}`)};
export const getMarketItem=(id:string)=>api(`/market/${id}`);
export const createMarketItem=(payload:any)=>api('/market',{method:'POST',body:JSON.stringify(payload)});
export const getSavedMarket=()=>api('/market/saved/mine');
export const saveMarketItem=(id:string)=>api(`/market/${id}/save`,{method:'POST'});
export const unsaveMarketItem=(id:string)=>api(`/market/${id}/save`,{method:'DELETE'});
export const createOrder=(marketItemId:string,payload:any={})=>api('/orders',{method:'POST',body:JSON.stringify({market_item_id:marketItemId,...payload})});
export const getMyOrders=()=>api('/orders/mine');
export const setOrderStatus=(id:string,status:string)=>api(`/orders/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});
export const getProfileReviews=(profileId:string)=>api(`/reviews/profile/${profileId}`);
export const createReview=(payload:any)=>api('/reviews',{method:'POST',body:JSON.stringify(payload)});
export const getRevenuePlans=()=>api('/revenue/plans');
export const getEarnings=()=>api('/revenue/earnings');
export const submitReport=(payload:any)=>api('/reports',{method:'POST',body:JSON.stringify(payload)});

export const getConversations=()=>api('/messages/conversations');
export const openConversation=(otherId:string)=>api(`/messages/open/${otherId}`,{method:'POST'});
export const getMessages=(conversationId:string,cursor?:string)=>api(`/messages/${conversationId}${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`);
export const sendMessage=(conversationId:string,body:string)=>api(`/messages/${conversationId}`,{method:'POST',body:JSON.stringify({body})});
export const getNotifications=()=>api('/notifications');
export const markAllNotificationsRead=()=>api('/notifications/read-all',{method:'POST'});
export const registerPushDevice=(pushToken:string,platform:string)=>api('/notifications/device',{method:'POST',body:JSON.stringify({push_token:pushToken,platform,provider:'expo'})});
