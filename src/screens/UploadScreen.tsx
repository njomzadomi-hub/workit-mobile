import React,{useEffect,useMemo,useState}from'react';
import{ActivityIndicator,ScrollView,StyleSheet,Switch,Text,TextInput,TouchableOpacity,View}from'react-native';
import*as ImagePicker from'expo-image-picker';
import{File}from'expo-file-system';
import{getMe,getMyOrganizations,getUploadUrl,publishJob,publishMarketItem,publishPost}from'../lib/api';
import{supabase}from'../lib/supabase';
import{C,F,R,S,postMeta}from'../lib/theme';
import{getProfessionProfile}from'../lib/professionProfile';

const primary=['hire_me','video','job'];
const secondary=['service','product','teach','pitch','donate'];
const jobTypes=['full_time','part_time','temporary','seasonal','internship'];
const MAX_VIDEO_BYTES=100*1024*1024;

export default function UploadScreen({navigation}:any){
 const[title,setTitle]=useState('');const[desc,setDesc]=useState('');const[type,setType]=useState('hire_me');const[profession,setProfession]=useState('');const[price,setPrice]=useState('');const[company,setCompany]=useState('');const[organizations,setOrganizations]=useState<any[]>([]);const[selectedOrg,setSelectedOrg]=useState<any>(null);const[jobType,setJobType]=useState('full_time');const[remote,setRemote]=useState(false);const[busy,setBusy]=useState(false);const[msg,setMsg]=useState('');
 useEffect(()=>{getMe().then((p:any)=>{if(p?.title)setProfession(p.title)}).catch(()=>{});getMyOrganizations().then((r:any)=>{const list=r.items||[];setOrganizations(list);if(list[0]){setSelectedOrg(list[0]);setCompany(list[0].name)}}).catch(()=>{})},[]);
 const meta=postMeta[type]||postMeta.video;const cfg=useMemo(()=>getProfessionProfile(profession),[profession]);const marketType=['service','product','teach'].includes(type);const isJob=type==='job';const needsProfession=!isJob;const effectiveCompany=selectedOrg?.name||company.trim();const canPublish=useMemo(()=>!!title.trim()&&(!needsProfession||!!profession.trim())&&(!isJob||!!effectiveCompany),[title,profession,effectiveCompany,needsProfession,isJob]);

 const publish=async()=>{
  setMsg('');
  const pick=await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Videos,videoMaxDuration:90,quality:1});
  if(pick.canceled)return;
  const asset=pick.assets[0];
  if(asset.fileSize&&asset.fileSize>MAX_VIDEO_BYTES){setMsg('Publish failed: video must be under 100 MB.');return}
  setBusy(true);
  try{
   const contentType=asset.mimeType||'video/mp4';
   const slot=await getUploadUrl(contentType);
   const file=new File(asset.uri);
   const bytes=await file.arrayBuffer();
   const{error:uploadError}=await supabase.storage.from('workit-videos').uploadToSignedUrl(slot.path,slot.token,bytes,{contentType,upsert:false});
   if(uploadError)throw uploadError;
   const tags=profession.trim()?[profession.trim()]:[];
   if(isJob){
    await publishJob({title:title.trim(),description:desc.trim()||null,company_name:effectiveCompany,organization_id:selectedOrg?.id||null,job_type:jobType,is_remote:remote,tags,requirements:tags,video_path:slot.path});
    setMsg('Job published to Feed + Find Jobs.');
   }else if(marketType){
    await publishMarketItem({type,title:title.trim(),description:desc.trim()||null,price_amount:price?Number(price):null,currency:'EUR',is_remote:remote,tags,video_path:slot.path,create_post:true,metadata:{profession:profession.trim()||null}});
    setMsg('Published to Feed + Market.');
   }else{
    await publishPost({type,title:title.trim(),description:desc.trim()||null,video_path:slot.path,tags});
    setMsg(type==='hire_me'?'Pitch published to WORKIT Feed.':'Published to WORKIT Feed.');
   }
   setTitle('');setDesc('');setPrice('');if(!selectedOrg)setCompany('');
   setTimeout(()=>navigation.navigate('Feed'),350);
  }catch(e:any){setMsg('Publish failed: '+(e?.message||'Please try again.'))}finally{setBusy(false)}
 };

 const choose=(t:string)=>{setType(t);setTitle('');setDesc('')};
 const chooseOrg=(org:any)=>{setSelectedOrg(org);setCompany(org?.name||'')};
 return<ScrollView style={s.page} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
  <View style={s.brand}><Text style={s.wordmark}>WORK<Text style={{color:C.violet2}}>IT</Text></Text><Text style={s.tagline}>SHOW YOURSELF. SHOW YOUR WORK.</Text></View>
  <Text style={s.h1}>What do you want people to see?</Text><Text style={s.sub}>A short video should be enough for someone to understand who you are, what you can do, and what should happen next.</Text>

  <View style={s.primaryRow}>
   <BigAction icon="◉" title="Pitch" sub="I’m available for work" active={type==='hire_me'} on={()=>choose('hire_me')}/>
   <BigAction icon="▶" title="Show work" sub={cfg.proofLabel} active={type==='video'} on={()=>choose('video')}/>
   <BigAction icon="＋" title="Hire" sub="Post a job" active={type==='job'} on={()=>choose('job')}/>
  </View>

  <Text style={s.moreK}>MORE</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.moreRow}>{secondary.map(t=>{const m=postMeta[t];return<TouchableOpacity key={t} onPress={()=>choose(t)} style={[s.more,type===t&&s.moreOn]}><Text style={[s.moreTxt,type===t&&s.moreTxtOn]}>{m.label}</Text></TouchableOpacity>})}</ScrollView>

  <View style={s.preview}><Text style={s.previewK}>{type==='hire_me'?'VIDEO PITCH':type==='video'?'WORK PROOF':meta.label}</Text><Text style={s.previewTitle}>{title||placeholderTitle(type,profession)}</Text>{profession&&!isJob?<Text style={s.previewProfession}>{profession}</Text>:null}{isJob&&effectiveCompany?<Text style={s.previewProfession}>{effectiveCompany}</Text>:null}<Text style={s.previewBody}>{desc||placeholderBody(type,cfg.pitchHint)}</Text><View style={s.previewCta}><Text style={s.previewCtaTxt}>{type==='hire_me'?'View profile':type==='video'?'See profile':meta.cta}</Text><Text style={s.previewCtaTxt}>→</Text></View></View>

  <View style={s.form}>{!isJob&&<Input l="Profession" v={profession} on={setProfession} ph="Your profession"/>}<Input l={type==='hire_me'?'Pitch headline':isJob?'Job title':'Headline'} v={title} on={setTitle} ph={placeholderTitle(type,profession)}/><Input l="Short context" v={desc} on={setDesc} area ph={placeholderBody(type,cfg.pitchHint)}/>{marketType&&<><Input l="Price / starting price (€)" v={price} on={setPrice} ph="45" keyboard="decimal-pad"/><Toggle t="Remote / online" b="Enable only if this can be delivered remotely." v={remote} on={setRemote}/></>}{isJob&&<>
   {organizations.length>0&&<><Text style={[s.label,{marginTop:14}]}>Post as</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.orgRow}>{organizations.map((org:any)=><TouchableOpacity key={org.id} onPress={()=>chooseOrg(org)} style={[s.orgChip,selectedOrg?.id===org.id&&s.orgChipOn]}><Text style={[s.orgName,selectedOrg?.id===org.id&&s.orgNameOn]}>{org.name}</Text><Text style={s.orgRole}>{org.my_role}</Text></TouchableOpacity>)}<TouchableOpacity onPress={()=>{setSelectedOrg(null);setCompany('')}} style={[s.orgChip,!selectedOrg&&s.orgChipOn]}><Text style={[s.orgName,!selectedOrg&&s.orgNameOn]}>Other</Text><Text style={s.orgRole}>manual</Text></TouchableOpacity></ScrollView></>}
   {!selectedOrg&&<Input l="Company / employer" v={company} on={setCompany} ph="Company name"/>}
   <Text style={[s.label,{marginTop:14}]}>Employment type</Text><View style={s.jobTypes}>{jobTypes.map(j=><TouchableOpacity key={j} onPress={()=>setJobType(j)} style={[s.jobType,jobType===j&&s.jobTypeOn]}><Text style={[s.jobTypeTxt,jobType===j&&s.jobTypeTxtOn]}>{j.replace('_',' ')}</Text></TouchableOpacity>)}</View><Toggle t="Remote" b="Leave off for an on-site role." v={remote} on={setRemote}/></>}</View>

  <TouchableOpacity disabled={busy||!canPublish} onPress={publish} style={[s.publish,{opacity:(busy||!canPublish)?.5:1}]}>{busy?<ActivityIndicator color="#fff"/>:<><View><Text style={s.publishK}>VIDEO · MAX 90 SEC</Text><Text style={s.publishTxt}>Choose clip & publish</Text></View><Text style={s.publishArrow}>→</Text></>}</TouchableOpacity>{!!msg&&<Text style={[s.msg,msg.startsWith('Publish failed')&&{color:C.red}]}>{msg}</Text>}
 </ScrollView>}
const BigAction=({icon,title,sub,active,on}:any)=><TouchableOpacity onPress={on} style={[s.big,active&&s.bigOn]}><Text style={[s.bigIcon,active&&s.bigIconOn]}>{icon}</Text><Text style={[s.bigTitle,active&&s.bigTitleOn]}>{title}</Text><Text style={s.bigSub}>{sub}</Text></TouchableOpacity>;
const placeholderTitle=(t:string,p:string)=>t==='hire_me'?`Meet ${p||'me'}`:t==='video'?`${p||'My'} work`:t==='job'?'Who are you hiring?':'What are you offering?';
const placeholderBody=(t:string,h:string)=>t==='hire_me'?'Say who you are, where you are, what you can do and when you can start.':t==='video'?h:t==='job'?'Role, location, schedule and what kind of person you need.':'Keep it short and useful.';
const Input=({l,v,on,ph,area,keyboard}:any)=><View style={{marginTop:14}}><Text style={s.label}>{l}</Text><TextInput value={v} onChangeText={on} placeholder={ph} placeholderTextColor={C.faint} keyboardType={keyboard||'default'} multiline={!!area} style={[s.input,area&&s.area]}/></View>;
const Toggle=({t,b,v,on}:any)=><View style={s.toggle}><View><Text style={s.toggleT}>{t}</Text><Text style={s.toggleB}>{b}</Text></View><Switch value={v} onValueChange={on} trackColor={{true:C.violet}}/></View>;
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{paddingTop:S.top,paddingHorizontal:S.pageX,paddingBottom:120},brand:{marginBottom:18},wordmark:{color:C.text,fontFamily:F.body,fontSize:32,fontWeight:'900',letterSpacing:-1.4},tagline:{color:C.muted,fontSize:7,fontWeight:'800',letterSpacing:1.8,marginTop:-2},h1:{color:C.text,fontSize:30,fontWeight:'900',lineHeight:35,letterSpacing:-1.1},sub:{color:C.muted,fontSize:12,lineHeight:19,marginTop:7},primaryRow:{flexDirection:'row',gap:8,marginTop:20},big:{flex:1,minHeight:116,borderRadius:18,borderWidth:1,borderColor:C.lineSoft,backgroundColor:C.panel,padding:12,justifyContent:'flex-end'},bigOn:{borderColor:C.violetSoft,backgroundColor:'#17112A'},bigIcon:{color:C.faint,fontSize:22,marginBottom:'auto'},bigIconOn:{color:C.violetSoft},bigTitle:{color:C.muted,fontSize:12,fontWeight:'900'},bigTitleOn:{color:C.text},bigSub:{color:C.faint,fontSize:8,lineHeight:12,marginTop:4},moreK:{color:C.faint,fontSize:8,fontWeight:'900',letterSpacing:1.2,marginTop:18},moreRow:{gap:7,paddingTop:8},more:{borderRadius:R.pill,borderWidth:1,borderColor:C.line,paddingHorizontal:11,paddingVertical:8},moreOn:{backgroundColor:C.violet,borderColor:C.violet},moreTxt:{color:C.muted,fontSize:8,fontWeight:'900'},moreTxtOn:{color:'#fff'},preview:{marginTop:18,borderWidth:1,borderColor:C.lineSoft,borderRadius:R.lg,backgroundColor:C.panel,padding:16},previewK:{color:C.violetSoft,fontSize:8,fontWeight:'900',letterSpacing:1.1},previewTitle:{color:C.text,fontSize:19,fontWeight:'900',marginTop:7},previewProfession:{color:C.muted,fontSize:9,fontWeight:'800',marginTop:3},previewBody:{color:C.muted,fontSize:11,lineHeight:17,marginTop:7},previewCta:{height:42,borderRadius:13,backgroundColor:'#F4F6FF',marginTop:13,paddingHorizontal:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},previewCtaTxt:{color:C.black,fontSize:10,fontWeight:'900'},form:{marginTop:4},label:{color:C.text,fontSize:10,fontWeight:'800',marginBottom:6},input:{borderWidth:1,borderColor:C.line,borderRadius:15,backgroundColor:C.panel,paddingHorizontal:13,paddingVertical:13,color:C.text,fontSize:12},area:{minHeight:94,textAlignVertical:'top'},toggle:{minHeight:62,marginTop:14,borderRadius:15,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,paddingHorizontal:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},toggleT:{color:C.text,fontSize:10,fontWeight:'900'},toggleB:{color:C.faint,fontSize:8,marginTop:3,maxWidth:240},orgRow:{gap:7,paddingBottom:3},orgChip:{minWidth:120,borderWidth:1,borderColor:C.line,borderRadius:14,paddingHorizontal:11,paddingVertical:9,backgroundColor:C.panel},orgChipOn:{borderColor:C.violetSoft,backgroundColor:'rgba(124,58,237,.12)'},orgName:{color:C.muted,fontSize:9,fontWeight:'900'},orgNameOn:{color:C.text},orgRole:{color:C.faint,fontSize:7,marginTop:3,textTransform:'capitalize'},jobTypes:{flexDirection:'row',flexWrap:'wrap',gap:7},jobType:{borderWidth:1,borderColor:C.line,borderRadius:R.pill,paddingHorizontal:10,paddingVertical:8},jobTypeOn:{backgroundColor:C.violet,borderColor:C.violet},jobTypeTxt:{color:C.muted,fontSize:8,fontWeight:'800',textTransform:'capitalize'},jobTypeTxtOn:{color:'#fff'},publish:{height:60,borderRadius:17,backgroundColor:C.violet,marginTop:20,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},publishK:{color:'rgba(255,255,255,.65)',fontSize:7,fontWeight:'900',letterSpacing:1},publishTxt:{color:'#fff',fontSize:12,fontWeight:'900',marginTop:2},publishArrow:{color:'#fff',fontSize:22},msg:{color:C.green,textAlign:'center',fontSize:10,fontWeight:'800',marginTop:12}});
