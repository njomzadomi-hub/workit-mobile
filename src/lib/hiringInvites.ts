import { supabase } from './supabase';
import { CONFIG } from './config';

const BASE=`${CONFIG.supabaseUrl}/functions/v1/workit-hiring`;
async function headers(){const{data}=await supabase.auth.getSession();return{Authorization:`Bearer ${data.session?.access_token??''}`,'Content-Type':'application/json'}}
async function call(path:string,opts:RequestInit={}){const res=await fetch(`${BASE}${path}`,{...opts,headers:{...(await headers()),...(opts.headers||{})}});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data?.error||`API ${res.status}`);return data}

export const createCandidateInvite=(payload:{candidate_id:string;job_post_id:string;conversation_id?:string|null})=>call('/invites',{method:'POST',body:JSON.stringify(payload)});
export const markCandidateInviteDelivered=(inviteId:string)=>call(`/invites/${inviteId}/delivered`,{method:'PATCH',body:'{}'});
