import { supabase } from './supabase';
import { CONFIG } from './config';

const BASE=`${CONFIG.supabaseUrl}/functions/v1/workit-notifications`;

export async function markNotificationRead(id:string){
 const{data}=await supabase.auth.getSession();
 const res=await fetch(`${BASE}/${encodeURIComponent(id)}/read`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${data.session?.access_token??''}`}});
 const body=await res.json().catch(()=>({}));
 if(!res.ok)throw new Error(body?.error||`API ${res.status}`);
 return body;
}
