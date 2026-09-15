import {supabase} from './supabase';
import {CONFIG} from './config';
const BASE=`${CONFIG.supabaseUrl}/functions/v1/workit-jobs`;
async function headers(){const{data}=await supabase.auth.getSession();return{Authorization:`Bearer ${data.session?.access_token??''}`,'Content-Type':'application/json'}}
export async function setJobActive(jobPostId:string,active:boolean){const r=await fetch(`${BASE}/jobs/${jobPostId}/active`,{method:'PATCH',headers:await headers(),body:JSON.stringify({active})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error||`API ${r.status}`);return d}
