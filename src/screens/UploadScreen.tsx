import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getUploadUrl, api, createJob, createMarketItem } from '../lib/api';
import { C, R, postMeta } from '../lib/theme';

const types=['video','hire_me','service','product','job','pitch','teach','donate'];
const jobTypes=['full_time','part_time','freelance','internship'];

export default function UploadScreen(){
 const [title,setTitle]=useState('');
 const [desc,setDesc]=useState('');
 const [type,setType]=useState('video');
 const [profession,setProfession]=useState('');
 const [price,setPrice]=useState('');
 const [company,setCompany]=useState('');
 const [jobType,setJobType]=useState('full_time');
 const [remote,setRemote]=useState(false);
 const [busy,setBusy]=useState(false);
 const [msg,setMsg]=useState('');
 const meta=postMeta[type];
 const marketType=['service','product','teach'].includes(type);
 const isJob=type==='job';
 const needsProfession=['hire_me','service','product','job','teach'].includes(type);
 const canPublish=useMemo(()=>!!title.trim()&&(!needsProfession||!!profession.trim())&&(!isJob||!!company.trim()),[title,profession,company,needsProfession,isJob]);

 const pickAndUpload=async()=>{
   setMsg('');
   const pick=await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Videos,videoMaxDuration:180});
   if(pick.canceled)return;
   setBusy(true);
   try{
     const {uploadUrl,videoUid}=await getUploadUrl();
     const file=pick.assets[0];
     const form=new FormData();
     form.append('file',{uri:file.uri,name:'video.mp4',type:'video/mp4'} as any);
     await fetch(uploadUrl,{method:'POST',body:form});
     const tags=profession.trim()?[profession.trim()]:[];

     if(isJob){
       await createJob({
         title:title.trim(),description:desc.trim()||null,company_name:company.trim(),job_type:jobType,
         is_remote:remote,tags,requirements:tags,cf_video_uid:videoUid
       });
       setMsg('Job published to Feed + Find Jobs.');
     } else if(marketType){
       await createMarketItem({
         type,title:title.trim(),description:desc.trim()||null,price_amount:price?Number(price):null,
         currency:'EUR',is_remote:remote,tags,cf_video_uid:videoUid,create_post:true,
         metadata:{profession:profession.trim()||null}
       });
       setMsg('Published to Feed + WORKIT Market.');
     } else {
       await api('/posts',{method:'POST',body:JSON.stringify({type,title:title.trim(),description:desc.trim()||null,cf_video_uid:videoUid,tags})});
       setMsg('Published to the WORKIT feed.');
     }
     setTitle('');setDesc('');setProfession('');setPrice('');setCompany('');
   }catch(e:any){setMsg('Publish failed: '+e.message)}
   setBusy(false);
 };

 return <ScrollView style={s.page} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
   <Text style={s.kicker}>CREATE A WORK ACTION</Text><Text style={s.h1}>Show work that leads somewhere.</Text><Text style={s.sub}>Post proof of work, get hired, sell, teach, recruit or raise support — every post has a purpose.</Text>
   <View style={s.types}>{types.map(t=>{const m=postMeta[t];return <TouchableOpacity key={t} onPress={()=>setType(t)} style={[s.type,type===t&&{borderColor:m.accent,backgroundColor:'#141414'}]}><View style={[s.dot,{backgroundColor:m.accent}]}/><Text style={[s.typeTxt,type===t&&{color:C.text}]}>{m.label}</Text></TouchableOpacity>})}</View>
   <View style={s.preview}><Text style={[s.previewType,{color:meta.accent}]}>{meta.label}</Text><Text style={s.previewTitle}>{title||'Your work headline'}</Text>{profession?<Text style={s.previewProfession}>{profession}</Text>:null}<Text style={s.previewBody}>{desc||'Tell people what is happening, what you can do, and what action they can take.'}</Text><View style={[s.previewCta,{backgroundColor:meta.accent}]}><Text style={s.previewCtaTxt}>{meta.cta} →</Text></View></View>

   {needsProfession&&<><Text style={s.label}>Profession</Text><TextInput style={s.input} placeholder="e.g. Barber, Architect, Welder, Nurse, React Developer" placeholderTextColor={C.faint} value={profession} onChangeText={setProfession}/></>}
   <Text style={s.label}>Headline</Text><TextInput style={s.input} placeholder={isJob?'e.g. Senior Barber — Valletta flagship salon':'e.g. Custom oak kitchen completed in Pristina'} placeholderTextColor={C.faint} value={title} onChangeText={setTitle}/>
   <Text style={s.label}>Context</Text><TextInput style={[s.input,s.area]} placeholder="Add proof, result, availability, requirements or what makes this work valuable." placeholderTextColor={C.faint} multiline value={desc} onChangeText={setDesc}/>

   {marketType&&<><Text style={s.label}>Price / starting price (€)</Text><TextInput keyboardType="decimal-pad" style={s.input} placeholder="e.g. 45" placeholderTextColor={C.faint} value={price} onChangeText={setPrice}/><View style={s.toggleRow}><View><Text style={s.toggleTitle}>Available remotely</Text><Text style={s.toggleHint}>Useful for lessons and remote services.</Text></View><Switch value={remote} onValueChange={setRemote}/></View></>}

   {isJob&&<><Text style={s.label}>Company / employer</Text><TextInput style={s.input} placeholder="Company name" placeholderTextColor={C.faint} value={company} onChangeText={setCompany}/><Text style={s.label}>Employment type</Text><View style={s.jobTypes}>{jobTypes.map(j=><TouchableOpacity key={j} onPress={()=>setJobType(j)} style={[s.jobType,jobType===j&&s.jobTypeOn]}><Text style={[s.jobTypeTxt,jobType===j&&s.jobTypeTxtOn]}>{j.replace('_',' ')}</Text></TouchableOpacity>)}</View><View style={s.toggleRow}><View><Text style={s.toggleTitle}>Remote job</Text><Text style={s.toggleHint}>Candidates worldwide can apply.</Text></View><Switch value={remote} onValueChange={setRemote}/></View></>}

   <TouchableOpacity style={[s.publish,{backgroundColor:meta.accent,opacity:(busy||!canPublish)?0.55:1}]} onPress={pickAndUpload} disabled={busy||!canPublish}>{busy?<ActivityIndicator color="#050505"/>:<><Text style={s.publishTxt}>{isJob?'Choose video & post job':marketType?'Choose video & publish listing':'Choose video & publish'}</Text><Text style={s.publishArrow}>↗</Text></>}</TouchableOpacity>
   {!!msg&&<Text style={s.msg}>{msg}</Text>}
 </ScrollView>
}

const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{paddingTop:58,paddingHorizontal:18,paddingBottom:120},kicker:{color:C.blue2,fontSize:10,fontWeight:'900',letterSpacing:1.4},h1:{color:C.text,fontSize:29,fontWeight:'800',lineHeight:35,letterSpacing:-1,marginTop:6},sub:{color:C.muted,fontSize:13,lineHeight:20,marginTop:7},types:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:20},type:{flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:11,paddingVertical:8,borderRadius:R.pill,borderWidth:1,borderColor:C.line,backgroundColor:C.panel},dot:{width:6,height:6,borderRadius:3},typeTxt:{color:C.muted,fontSize:9,fontWeight:'900',letterSpacing:.5},preview:{marginTop:18,padding:18,borderRadius:22,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},previewType:{fontSize:9,fontWeight:'900',letterSpacing:.9},previewTitle:{color:C.text,fontSize:17,fontWeight:'800',marginTop:8},previewProfession:{color:C.blue2,fontSize:10,fontWeight:'800',marginTop:4},previewBody:{color:C.muted,fontSize:12,lineHeight:18,marginTop:5},previewCta:{alignSelf:'flex-start',paddingHorizontal:12,paddingVertical:8,borderRadius:R.pill,marginTop:12},previewCtaTxt:{color:'#050505',fontSize:10,fontWeight:'900'},label:{color:C.text,fontSize:11,fontWeight:'800',marginTop:18,marginBottom:7},input:{backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:15,paddingHorizontal:14,paddingVertical:14,color:C.text,fontSize:14},area:{height:108,textAlignVertical:'top'},jobTypes:{flexDirection:'row',flexWrap:'wrap',gap:7},jobType:{borderWidth:1,borderColor:C.line,borderRadius:R.pill,paddingHorizontal:11,paddingVertical:8},jobTypeOn:{backgroundColor:C.text,borderColor:C.text},jobTypeTxt:{color:C.muted,fontSize:9,fontWeight:'800',textTransform:'capitalize'},jobTypeTxtOn:{color:'#000'},toggleRow:{minHeight:62,marginTop:14,borderRadius:15,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},toggleTitle:{color:C.text,fontSize:11,fontWeight:'800'},toggleHint:{color:C.faint,fontSize:9,marginTop:3},publish:{height:54,borderRadius:16,marginTop:20,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},publishTxt:{color:'#050505',fontSize:13,fontWeight:'900'},publishArrow:{color:'#050505',fontSize:19,fontWeight:'800'},msg:{color:C.green,textAlign:'center',fontSize:12,fontWeight:'700',marginTop:12}});