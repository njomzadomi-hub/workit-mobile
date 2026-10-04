import {supabase}from'./supabase';
import{CONFIG}from'./config';
const SOCIAL_API=`${CONFIG.supabaseUrl}/functions/v1/workit-social`;
export async function trackPostView(postId:string){if(!postId||postId.startsWith('demo-'))return;const{data}=await supabase.auth.getSession();const token=data.session?.access_token;if(!token)return;await fetch(`${SOCIAL_API}/view/${postId}`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}}).catch(()=>{});}
