import React,{useEffect,useState}from'react';
import{View,Text,ScrollView,TouchableOpacity,StyleSheet,Alert}from'react-native';
import{applyToJob,getJob,getOrganizationById,openConversation}from'../lib/api';
import{C}from'../lib/theme';

export default function JobDetailScreen({route,navigation}:any){
 const id=route.params?.jobId||route.params?.id;const[post,setPost]=useState<any>(null);const[org,setOrg]=useState<any>(null);const[busy,setBusy]=useState(false);
 useEffect(()=>{if(!id)return;getJob(id).then(async(x:any)=>{setPost(x);const orgId=x?.job?.organization_id;if(orgId){try{setOrg(await getOrganizationById(orgId))}catch{setOrg(null)}}}).catch(()=>Alert.alert('Could not load job'))},[id]);
 if(!post)return<View style={s.page}/>;
 const j=post.job||{};
 const apply=async()=>{setBusy(true);try{await applyToJob(id,{source:'job_detail'});Alert.alert('Application sent','Your WORKIT profile and proof of work were submitted.')}catch{Alert.alert('Could not apply','You may already have applied, or the job is unavailable.')}finally{setBusy(false)}};
 const message=async()=>{if(!post.author?.id)return;const c=await openConversation(post.author.id);navigation.navigate('Chat',{conversationId:c.id,other:post.author})};
 const openCompany=()=>{if(j.organization_id)navigation.navigate('CompanyPublic',{id:j.organization_id})};
 const requirements=j.requirements||post.tags||[];
 return<ScrollView style={s.page} contentContainerStyle={s.content}>
  <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹ Back</Text></TouchableOpacity>
  <Text style={s.kicker}>JOB OPPORTUNITY</Text><Text style={s.h1}>{post.title}</Text>
  {j.organization_id?<TouchableOpacity onPress={openCompany} style={s.companyRow}><View><Text style={s.company}>{org?.name||j.company_name||'WORKIT employer'}</Text><Text style={s.companyHint}>View company →</Text></View>{org?.verified&&<Text style={s.verified}>✓</Text>}</TouchableOpacity>:<Text style={s.company}>{j.company_name||'WORKIT employer'}</Text>}
  <View style={s.metaRow}><Text style={s.meta}>{j.is_remote?'Remote':post.country_code||org?.location||'On-site'}</Text><Text style={s.meta}>{String(j.job_type||'job').replace('_',' ')}</Text></View>
  {(j.salary_min||j.salary_max)&&<Text style={s.salary}>Salary: {j.salary_min||'—'}{j.salary_max?` – ${j.salary_max}`:''}</Text>}
  <Text style={s.section}>About the role</Text><Text style={s.body}>{post.description||'See the WORKIT job post for full context.'}</Text>
  <Text style={s.section}>Skills / requirements</Text><View style={s.skills}>{requirements.length?requirements.map((x:string)=><Text key={x} style={s.skill}>{x}</Text>):<Text style={s.body}>No specific requirements listed.</Text>}</View>
  <TouchableOpacity style={s.primary} onPress={apply} disabled={busy}><Text style={s.primaryTxt}>{busy?'Applying…':'Apply with WORKIT profile'}</Text></TouchableOpacity>
  <TouchableOpacity style={s.secondary} onPress={message}><Text style={s.secondaryTxt}>Message employer</Text></TouchableOpacity>
 </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{padding:18,paddingTop:54,paddingBottom:80},back:{color:C.muted,fontSize:13,fontWeight:'800'},kicker:{color:C.green,fontSize:9,fontWeight:'900',letterSpacing:1.2,marginTop:30},h1:{color:C.text,fontSize:30,fontWeight:'900',lineHeight:36,marginTop:7},companyRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10,paddingVertical:4},company:{color:C.blue2,fontSize:15,fontWeight:'800',marginTop:10},companyRowCompany:{marginTop:0},companyHint:{color:C.faint,fontSize:8,fontWeight:'800',marginTop:3},verified:{color:C.blue2,fontSize:15,fontWeight:'900'},metaRow:{flexDirection:'row',gap:8,marginTop:15},meta:{color:C.muted,fontSize:10,fontWeight:'800',borderWidth:1,borderColor:C.line,paddingHorizontal:10,paddingVertical:6,borderRadius:999,textTransform:'capitalize'},salary:{color:C.text,fontSize:15,fontWeight:'900',marginTop:20},section:{color:C.text,fontSize:14,fontWeight:'900',marginTop:26,marginBottom:8},body:{color:C.muted,fontSize:13,lineHeight:21},skills:{flexDirection:'row',flexWrap:'wrap',gap:7},skill:{color:C.blue2,fontSize:9,fontWeight:'800',paddingHorizontal:9,paddingVertical:6,borderRadius:8,backgroundColor:C.panel},primary:{height:54,borderRadius:16,backgroundColor:C.text,alignItems:'center',justifyContent:'center',marginTop:28},primaryTxt:{color:'#000',fontSize:13,fontWeight:'900'},secondary:{height:50,borderRadius:16,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginTop:9},secondaryTxt:{color:C.text,fontSize:12,fontWeight:'900'}});