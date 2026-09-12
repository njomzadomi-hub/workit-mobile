import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { applyToJob, getJob, openConversation } from '../lib/api';
import { C } from '../lib/theme';

export default function JobDetailScreen({route,navigation}:any){
 const {id}=route.params; const [job,setJob]=useState<any>(null); const [busy,setBusy]=useState(false);
 useEffect(()=>{getJob(id).then(setJob).catch(()=>Alert.alert('Could not load job'))},[id]);
 if(!job)return <View style={s.page}/>;
 const apply=async()=>{setBusy(true);try{await applyToJob(id,{source:'job_detail'});Alert.alert('Application sent','Your WORKIT profile and proof of work were submitted.')}catch{Alert.alert('Could not apply','You may already have applied, or the job is unavailable.')}finally{setBusy(false)}};
 const message=async()=>{if(!job.author?.id)return;const c=await openConversation(job.author.id);navigation.navigate('Chat',{conversationId:c.id,other:job.author})};
 return <ScrollView style={s.page} contentContainerStyle={s.content}>
  <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹ Back</Text></TouchableOpacity>
  <Text style={s.kicker}>JOB OPPORTUNITY</Text><Text style={s.h1}>{job.title}</Text><Text style={s.company}>{job.company_name}</Text>
  <View style={s.metaRow}><Text style={s.meta}>{job.is_remote?'Remote':job.country_code||'On-site'}</Text><Text style={s.meta}>{String(job.job_type||'job').replace('_',' ')}</Text></View>
  {(job.salary_min||job.salary_max)&&<Text style={s.salary}>Salary: {job.salary_min||'—'}{job.salary_max?` – ${job.salary_max}`:''}</Text>}
  <Text style={s.section}>About the role</Text><Text style={s.body}>{job.description||'See the WORKIT job post for full context.'}</Text>
  <Text style={s.section}>Skills / requirements</Text><View style={s.skills}>{(job.requirements||job.tags||[]).map((x:string)=><Text key={x} style={s.skill}>{x}</Text>)}</View>
  <TouchableOpacity style={s.primary} onPress={apply} disabled={busy}><Text style={s.primaryTxt}>{busy?'Applying…':'Apply with WORKIT profile'}</Text></TouchableOpacity>
  <TouchableOpacity style={s.secondary} onPress={message}><Text style={s.secondaryTxt}>Message employer</Text></TouchableOpacity>
 </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{padding:18,paddingTop:54,paddingBottom:80},back:{color:C.muted,fontSize:13,fontWeight:'800'},kicker:{color:C.green,fontSize:9,fontWeight:'900',letterSpacing:1.2,marginTop:30},h1:{color:C.text,fontSize:30,fontWeight:'900',lineHeight:36,marginTop:7},company:{color:C.blue2,fontSize:15,fontWeight:'800',marginTop:10},metaRow:{flexDirection:'row',gap:8,marginTop:15},meta:{color:C.muted,fontSize:10,fontWeight:'800',borderWidth:1,borderColor:C.line,paddingHorizontal:10,paddingVertical:6,borderRadius:999,textTransform:'capitalize'},salary:{color:C.text,fontSize:15,fontWeight:'900',marginTop:20},section:{color:C.text,fontSize:14,fontWeight:'900',marginTop:26,marginBottom:8},body:{color:C.muted,fontSize:13,lineHeight:21},skills:{flexDirection:'row',flexWrap:'wrap',gap:7},skill:{color:C.blue2,fontSize:9,fontWeight:'800',paddingHorizontal:9,paddingVertical:6,borderRadius:8,backgroundColor:C.panel},primary:{height:54,borderRadius:16,backgroundColor:C.text,alignItems:'center',justifyContent:'center',marginTop:28},primaryTxt:{color:'#000',fontSize:13,fontWeight:'900'},secondary:{height:50,borderRadius:16,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginTop:9},secondaryTxt:{color:C.text,fontSize:12,fontWeight:'900'}});