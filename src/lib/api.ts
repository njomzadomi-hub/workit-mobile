import { supabase } from './supabase';
import { CONFIG } from './config';
const API = CONFIG.apiUrl;
const PUBLISH_API = `${CONFIG.supabaseUrl}/functions/v1/workit-publish`;
const SOCIAL_API = `${CONFIG.supabaseUrl}/functions/v1/workit-social`;
const TALENT_API = `${CONFIG.supabaseUrl}/functions/v1/workit-talent`;
const ORG_API = `${CONFIG.supabaseUrl}/functions/v1/workit-org`;
const JOBS_API = `${CONFIG.supabaseUrl}/functions/v1/workit-jobs`;
const HIRING_API = `${CONFIG.supabaseUrl}/functions/v1/workit-hiring`;

async function authHeader(){const{data}=await supabase.auth.getSession();return{Authorization:`Bearer ${data.session?.access_token??''}`}}
export async function api(path:string,opts:RequestInit={}){const res=await fetch(`${API}${path}`,{...opts,headers:{'Content-Type':'application/json',...(await authHeader()),...(opts.headers||{})}});if(!res.ok)throw new Error(`API ${res.status}`);return res.json()}
async function edge(base:string,path:string,opts:RequestInit={}){const res=await fetch(`${base}${path}`,{...opts,headers:{'Content-Type':'application/json',...(await authHeader()),...(opts.headers||{})}});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data?.error||`API ${res.status}`);return data}
async function publishCall(action:string,payload:any={}){return edge(PUBLISH_API,'',{method:'POST',body:JSON.stringify({action,...payload})})}

export const getFeed=(cursor?:string,mode:'for_you'|'following'='for_you')=>{const q=new URLSearchParams();q.set('mode',mode);if(cursor)q.set('cursor',cursor);return edge(SOCIAL_API,`/feed?${q.toString()}`)};
export const getProfilePosts=(profileId:string,cursor?:string)=>edge(SOCIAL_API,`/profile/${profileId}/posts${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`);
export const getFollowStatus=(profileId:string)=>edge(SOCIAL_API,`/follow/${profileId}`);
export const followProfile=(profileId:string)=>edge(SOCIAL_API,`/follow/${profileId}`,{method:'POST'});
export const unfollowProfile=(profileId:string)=>edge(SOCIAL_API,`/follow/${profileId}`,{method:'DELETE'});
export const likePost=(id:string)=>api(`/posts/${id}/like`,{method:'POST'});
export const getComments=(id:string,cursor?:string)=>api(`/posts/${id}/comments${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`);
export const addComment=(id:string,body:string)=>api(`/posts/${id}/comments`,{method:'POST',body:JSON.stringify({body})});
export const getMe=()=>api('/profiles/me');
export const updateMe=(payload:any)=>api('/profiles/me',{method:'PATCH',body:JSON.stringify(payload)});
export const getPreferences=()=>api('/profiles/me/preferences');
export const requestAccountDeletion=(reason?:string)=>api('/profiles/me/deletion-request',{method:'POST',body:JSON.stringify({reason})});
export const cancelAccountDeletion=()=>api('/profiles/me/deletion-request',{method:'DELETE'});
export const getProfile=(username:string)=>api(`/profiles/${encodeURIComponent(username)}`);

export const getUploadUrl=(contentType='video/mp4')=>publishCall('upload-url',{content_type:contentType});
export const publishPost=(payload:any)=>publishCall('create-post',payload);
export const publishJob=(payload:any)=>publishCall('create-job',payload);
export const publishMarketItem=(payload:any)=>publishCall('create-market',payload);

export const searchTalent=(params:{query?:string;profession?:string;skill?:string;location?:string;country?:string;available?:boolean;limit?:number}={})=>{const merged={...params,query:params.query||params.skill};const qs=Object.entries(merged).filter(([,v])=>v!==undefined&&v!==''&&v!==false).map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');return edge(TALENT_API,`/?${qs}`)};
export const getJobs=(params:{remote?:boolean;job_type?:string;country?:string;cursor?:string;limit?:number}={})=>{const qs=Object.entries(params).filter(([,v])=>v!==undefined&&v!==''&&v!==false).map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');return edge(JOBS_API,`/jobs${qs?`?${qs}`:''}`)};
export const getJob=(jobId:string)=>edge(JOBS_API,`/jobs/${jobId}`);
export const createJob=(payload:any)=>api('/jobs',{method:'POST',body:JSON.stringify(payload)});
export const getMyJobs=()=>edge(JOBS_API,'/jobs/mine');
async function applyRaw(jobId:string,payload:any={}){return api(`/jobs/${jobId}/apply`,{method:'POST',body:JSON.stringify(payload)})}
export async function applyToJob(jobId:string,payload:any={}){let video_cf_uid:string|undefined;try{const me=await getMe();const work=await getProfilePosts(me.id);const pitch=(work.items||[]).find((x:any)=>x.type==='hire_me'&&x.cf_video_uid);video_cf_uid=pitch?.cf_video_uid}catch{}return applyRaw(jobId,{...payload,video_cf_uid})}
export const applyWithProfile=applyToJob;
export const getMyApplications=()=>api('/applications/mine');
export const getJobApplications=(jobId:string)=>api(`/jobs/${jobId}/applications`);
export const setApplicationStatus=(applicationId:string,status:string)=>edge(HIRING_API,`/applications/${applicationId}/status`,{method:'PATCH',body:JSON.stringify({status})});
export const getMyWorkRelationships=()=>edge(HIRING_API,'/work/mine');

export const getMyOrganizations=()=>edge(ORG_API,'/mine');
export const createOrganization=(payload:any)=>edge(ORG_API,'/organizations',{method:'POST',body:JSON.stringify(payload)});
export const getOrganization=(slug:string)=>edge(ORG_API,`/organizations/slug/${encodeURIComponent(slug)}`);
export const getOrganizationById=(id:string)=>edge(ORG_API,`/organizations/id/${id}`);
export const updateOrganization=(id:string,payload:any)=>edge(ORG_API,`/organizations/${id}`,{method:'PATCH',body:JSON.stringify(payload)});

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
