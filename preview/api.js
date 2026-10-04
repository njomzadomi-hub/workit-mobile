export const people=[{id:'demo-mira',username:'mira',full_name:'Mira K.',title:'Designer',location:'Prishtina',skills:['Branding','Figma'],tools:['Figma'],available_for_work:true,completed_jobs:3,verified:false},{id:'demo-ardi',username:'ardi',full_name:'Ardi B.',title:'Electrician',location:'Prishtina',skills:['Installation','Safety'],available_for_work:true,completed_jobs:0,verified:false}];
export const getFeed=async()=>({items:[],nextCursor:null});
export const getJobs=async()=>({items:[]});
export const searchTalent=async({query='',profession='',location=''})=>({items:people.filter(p=>`${p.full_name} ${p.title} ${p.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())&&p.title.toLowerCase().includes(profession.toLowerCase())&&p.location.toLowerCase().includes(location.toLowerCase()))});
const blocked=async()=>{throw new Error('Visual preview only. No messages, applications or offers are sent.');};
export const applyToJob=blocked,openConversation=blocked,sendMessage=blocked,scheduleInterview=blocked,sendStructuredOffer=blocked,saveCandidate=blocked,unsaveCandidate=blocked;
export const getSavedCandidates=async()=>({items:[]});
export const supabase={auth:{resetPasswordForEmail:blocked,updateUser:blocked,signOut:blocked,signInWithPassword:async()=>({error:{message:'Visual preview only. Login is available in the native app.'}})}};
