import { supabase } from './supabase';
import { CONFIG } from './config';

const BASE=`${CONFIG.supabaseUrl}/functions/v1/workit-talent`;

async function authHeader(){const{data}=await supabase.auth.getSession();return{Authorization:`Bearer ${data.session?.access_token??''}`,'Content-Type':'application/json'}}
async function call(path:string,opts:RequestInit={}){const res=await fetch(`${BASE}${path}`,{...opts,headers:{...(await authHeader()),...(opts.headers||{})}});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data?.error||`API ${res.status}`);return data}

export const getSavedCandidates=()=>call('/saved');
export const getSavedCandidateStatus=(candidateId:string)=>call(`/saved/${candidateId}`);
export const saveCandidate=(candidateId:string,note?:string)=>call(`/saved/${candidateId}`,{method:'POST',body:JSON.stringify({note:note||null})});
export const unsaveCandidate=(candidateId:string)=>call(`/saved/${candidateId}`,{method:'DELETE'});
