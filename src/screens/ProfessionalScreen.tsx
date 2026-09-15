import React,{useEffect,useState}from'react';
import{View,Text,ScrollView,TouchableOpacity,StyleSheet,Alert,Image}from'react-native';
import{Video,ResizeMode}from'expo-av';
import{followProfile,getFollowStatus,getProfile,getProfilePosts,getProfileReviews,getProfileWorkRelationships,openConversation,submitReport,unfollowProfile}from'../lib/api';
import{getSavedCandidateStatus,saveCandidate,unsaveCandidate}from'../lib/talentPool';
import{getProfessionProfile}from'../lib/professionProfile';
import{C,F,R,S}from'../lib/theme';

export default function ProfessionalScreen({route,navigation}:any){
 const{username}=route.params;
 const[p,setP]=useState<any>(route.params?.profile||null);
 const[tab,setTab]=useState<'about'|'work'|'reviews'>('about');
 const[following,setFollowing]=useState(false);
 const[followBusy,setFollowBusy]=useState(false);
 const[reportBusy,setReportBusy]=useState(false);
 const[savedCandidate,setSavedCandidate]=useState(false);
 const[saveBusy,setSaveBusy]=useState(false);
 const[posts,setPosts]=useState<any[]>([]);
 const[reviews,setReviews]=useState<any[]>([]);
 const[verifiedWork,setVerifiedWork]=useState<any[]>([]);

 useEffect(()=>{getProfile(username).then(setP).catch(()=>!p&&Alert.alert('Could not load professional'))},[username]);
 useEffect(()=>{if(!p?.id)return;void Promise.all([
  getFollowStatus(p.id).then((x:any)=>setFollowing(!!x.following)).catch(()=>{}),
  getProfilePosts(p.id).then((x:any)=>setPosts(x.items||[])).catch(()=>setPosts([])),
  getProfileReviews(p.id).then((x:any)=>setReviews(x.items||[])).catch(()=>setReviews([])),
  getProfileWorkRelationships(p.id).then((x:any)=>setVerifiedWork(x.items||[])).catch(()=>setVerifiedWork([])),
  getSavedCandidateStatus(p.id).then((x:any)=>setSavedCandidate(!!x.saved)).catch(()=>{})
 ])},[p?.id]);

 if(!p)return<View style={s.page}/>;
 const cfg=getProfessionProfile(p.title);
 const skills=Array.isArray(p.skills)?p.skills:[];
 const tools=Array.isArray(p.tools)?p.tools:[];
 const quals=Array.isArray(p.qualifications)?p.qualifications:[];
 const certs=Array.isArray(p.certifications)?p.certifications:[];
 const highlights=[...tools,...skills].filter((x:string)=>cfg.highlightTerms.some(t=>String(x).toLowerCase().includes(t.toLowerCase()))).slice(0,4);
 const pitch=posts.find((x:any)=>x.type==='hire_me'&&x.cf_playback_url)||null;

 const message=async()=>{try{const c=await openConversation(p.id);navigation.navigate('Chat',{conversationId:c.id,other:p})}catch{Alert.alert('Could not open chat')}};
 const toggleFollow=async()=>{if(followBusy)return;setFollowBusy(true);try{const r=following?await unfollowProfile(p.id):await followProfile(p.id);setFollowing(!!r.following);setP((prev:any)=>({...prev,follower_count:r.follower_count??prev.follower_count}))}catch{Alert.alert('Could not update follow')}finally{setFollowBusy(false)}};
 const toggleSaved=async()=>{if(saveBusy)return;setSaveBusy(true);const wasSaved=savedCandidate;setSavedCandidate(!wasSaved);try{wasSaved?await unsaveCandidate(p.id):await saveCandidate(p.id)}catch{setSavedCandidate(wasSaved);Alert.alert('Could not update talent pool','Check your connection and try again.')}finally{setSaveBusy(false)}};
 const sendReport=async(reason:string)=>{if(reportBusy)return;setReportBusy(true);try{await submitReport({target_type:'profile',target_id:p.id,reason});Alert.alert('Report sent','Thank you. This profile has been added to the WORKIT moderation queue.')}catch{Alert.alert('Could not send report','Check your connection and try again.')}finally{setReportBusy(false)}};
 const report=()=>Alert.alert('Report this profile','Choose the reason that best describes the problem.',[
  {text:'Impersonation',onPress:()=>void sendReport('impersonation')},
  {text:'Scam or fraud',onPress:()=>void sendReport('scam')},
  {text:'Harassment',onPress:()=>void sendReport('harassment')},
  {text:'Misleading work claims',onPress:()=>void sendReport('misleading')},
  {text:'Other',onPress:()=>void sendReport('other')},
  {text:'Cancel',style:'cancel'}
 ]);

 return<ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
  <View style={s.top}>
   <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹</Text></TouchableOpacity>
   <Text style={s.wordmark}>WORK<Text style={s.it}>IT</Text></Text>
   <TouchableOpacity onPress={()=>navigation.navigate('GlobalSearch')}><Text style={s.search}>⌕</Text></TouchableOpacity>
  </View>

  <View style={s.hero}>
   <View style={s.identity}>
    {p.avatar_url?<Image source={{uri:p.avatar_url}} style={s.avatar}/>:<View style={[s.avatar,s.avatarPh]}><Text style={s.initial}>{p.full_name?.[0]||'W'}</Text></View>}
    <View style={s.body}>
     <View style={s.nameRow}><Text numberOfLines={1} style={s.name}>{p.full_name||'WORKIT member'}</Text>{p.verified&&<Text style={s.verified}>✓</Text>}</View>
     <Text style={s.role}>{p.title||'Professional'}</Text>
     <Text style={s.location}>⌖ {p.location||'Global'}</Text>
     <View style={s.availability}><View style={[s.statusDot,{backgroundColor:p.available_for_work?C.green:C.faint}]}/><Text style={s.availabilityTxt}>{p.available_for_work?'Available for work':'Not available'}</Text></View>
    </View>
   </View>
   {!!p.bio&&<Text style={s.bio}>{p.bio}</Text>}
   {!!highlights.length&&<View style={s.highlights}>{highlights.map((x:string)=><View key={x} style={s.highlight}><Text style={s.highlightTxt}>{x}</Text></View>)}</View>}
   {!!pitch&&<View style={s.pitchHero}><Video source={{uri:pitch.cf_playback_url}} style={s.pitchHeroVideo} resizeMode={ResizeMode.COVER} useNativeControls shouldPlay={false}/><View style={s.pitchHeroBadge}><Text style={s.pitchHeroBadgeTxt}>VIDEO PITCH</Text></View><View style={s.pitchHeroCopy}><Text numberOfLines={1} style={s.pitchHeroTitle}>{pitch.title||`Meet ${p.full_name||'this professional'}`}</Text><Text style={s.pitchHeroMeta}>See the person before the CV.</Text></View></View>}
   <View style={s.metrics}><Metric n={verifiedWork.length} l="Verified work"/><Metric n={reviews.length||p.review_count||0} l="Reviews"/><Metric n={p.follower_count||0} l="Followers"/></View>
   <View style={s.actions}>
    <TouchableOpacity onPress={()=>navigation.navigate('CandidateInvite',{candidate:p})} style={s.primary}><Text style={s.primaryTxt}>Invite to job</Text></TouchableOpacity>
    <TouchableOpacity onPress={message} style={s.secondary}><Text style={s.secondaryTxt}>Message</Text></TouchableOpacity>
    <TouchableOpacity disabled={followBusy} onPress={toggleFollow} style={[s.secondary,following&&s.following]}><Text style={s.secondaryTxt}>{following?'Following':'Follow'}</Text></TouchableOpacity>
   </View>
   <TouchableOpacity disabled={saveBusy} onPress={()=>void toggleSaved()} style={[s.saveCandidate,savedCandidate&&s.saveCandidateOn]}><Text style={[s.saveCandidateTxt,savedCandidate&&s.saveCandidateTxtOn]}>{saveBusy?'Updating…':savedCandidate?'♥ Saved to talent pool':'♡ Save candidate'}</Text></TouchableOpacity>
  </View>

  <View style={s.tabs}>{(['about','work','reviews'] as const).map(x=><TouchableOpacity key={x} onPress={()=>setTab(x)} style={[s.tab,tab===x&&s.tabOn]}><Text style={[s.tabTxt,tab===x&&s.tabTxtOn]}>{x==='work'?cfg.proofLabel:x[0].toUpperCase()+x.slice(1)}</Text></TouchableOpacity>)}</View>

  {tab==='about'?<>
   <Section title="Verified Work" count={verifiedWork.length}>{verifiedWork.length?<View style={s.verifiedList}>{verifiedWork.map((w:any)=><View key={w.id} style={s.workVerified}><View style={s.workVerifiedHead}><View style={s.check}><Text style={s.checkTxt}>✓</Text></View><View style={{flex:1}}><Text style={s.workVerifiedTitle}>{w.job?.title||'WORKIT role'}</Text><Text style={s.workVerifiedCompany}>{w.organization?.name||w.employer?.full_name||'Verified employer'}</Text></View><Text style={s.workVerifiedStatus}>{String(w.status||'active').toUpperCase()}</Text></View><Text style={s.workVerifiedMeta}>Hired through WORKIT · {w.hired_at?new Date(w.hired_at).toLocaleDateString():''}</Text></View>)}</View>:<Empty t="No verified WORKIT employment yet."/>}</Section>
   <Section title={cfg.proofLabel} count={posts.length}><View style={s.proofBox}><View style={{flex:1}}><Text style={s.proofK}>{cfg.label.toUpperCase()}</Text><Text style={s.proofT}>{cfg.pitchHint}</Text></View><TouchableOpacity onPress={()=>setTab('work')} style={s.proofBtn}><Text style={s.proofArrow}>›</Text></TouchableOpacity></View></Section>
   <Section title="Skills" count={skills.length}>{skills.length?<View style={s.chips}>{skills.map((x:string)=><View key={x} style={s.chip}><Text style={s.chipTxt}>{x}</Text></View>)}</View>:<Empty t="No skills listed yet"/>}</Section>
   <Section title="Tools & Software" count={tools.length}>{tools.length?<View style={s.chips}>{tools.map((x:string)=><View key={x} style={s.chip}><Text style={s.chipTxt}>{x}</Text></View>)}</View>:<Empty t="No tools listed yet"/>}</Section>
   <Section title="Qualifications" count={quals.length}>{quals.length?<View style={s.grid}>{quals.map((q:any,i:number)=><View key={i} style={s.cred}><Text style={s.credTitle}>{q.degree||q.title||'Qualification'}</Text><Text style={s.credMeta}>{q.institution||q.school||''}</Text><Text style={s.credYears}>{q.years||''}</Text></View>)}</View>:<Empty t="No qualifications added yet"/>}</Section>
   <Section title="Certifications" count={certs.length}>{certs.length?<View style={s.grid}>{certs.map((c:any,i:number)=><View key={i} style={s.cred}><Text style={s.certMark}>✓</Text><Text style={s.credTitle}>{c.name||c.title||'Certification'}</Text><Text style={s.credMeta}>{c.issuer||''}</Text></View>)}</View>:<Empty t="No certifications added yet"/>}</Section>
  </>:tab==='work'?<Portfolio posts={posts} cfg={cfg}/>:<Reviews reviews={reviews}/>} 

  <TouchableOpacity disabled={reportBusy} onPress={report} style={s.report}><Text style={s.reportTxt}>{reportBusy?'Sending report…':'Report this profile'}</Text></TouchableOpacity>
 </ScrollView>
}

const Portfolio=({posts,cfg}:any)=>posts.length?<View style={s.portfolio}>{posts.map((x:any)=><View key={x.id} style={s.workCard}>{x.cf_playback_url?<Video source={{uri:x.cf_playback_url}} style={s.media} resizeMode={ResizeMode.COVER} useNativeControls shouldPlay={false}/>:x.thumbnail_url?<Image source={{uri:x.thumbnail_url}} style={s.media}/>:<View style={[s.media,s.mediaPh]}><Text style={s.play}>▶</Text></View>}<Text numberOfLines={2} style={s.workTitle}>{x.title||cfg.proofLabel}</Text><Text style={s.workMeta}>{String(x.type||'work').replace('_',' ')} · {x.view_count||0} views</Text></View>)}</View>:<Empty t="No work proof published yet."/>;
const Reviews=({reviews}:any)=>reviews.length?<View style={s.reviewList}>{reviews.map((r:any)=><View key={r.id} style={s.review}><Text style={s.reviewName}>{r.reviewer?.full_name||'WORKIT user'}</Text><Text style={s.stars}>{'★'.repeat(Math.max(1,Math.min(5,Number(r.rating||0))))}</Text>{!!r.comment&&<Text style={s.reviewBody}>{r.comment}</Text>}</View>)}</View>:<Empty t="No verified reviews yet."/>;
const Metric=({n,l}:any)=><View style={s.metric}><Text style={s.metricN}>{n}</Text><Text style={s.metricL}>{l}</Text></View>;
const Section=({title,count,children}:any)=><View style={s.section}><View style={s.sectionHead}><Text style={s.sectionTitle}>{title}</Text><Text style={s.count}>{count}</Text></View>{children}</View>;
const Empty=({t}:any)=><View style={s.empty}><Text style={s.emptyTxt}>{t}</Text></View>;

const s=StyleSheet.create({
 page:{flex:1,backgroundColor:C.bg},content:{paddingTop:S.top,paddingHorizontal:S.pageX,paddingBottom:100},top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{color:C.text,fontSize:34},wordmark:{color:C.text,fontFamily:F.body,fontSize:26,fontWeight:'900',letterSpacing:-1.2},it:{color:C.violet2},search:{color:C.text,fontSize:26},
 hero:{marginTop:14,borderRadius:22,borderWidth:1,borderColor:C.lineSoft,backgroundColor:C.panel,padding:14},identity:{flexDirection:'row',gap:12},avatar:{width:105,height:122,borderRadius:18},avatarPh:{backgroundColor:C.panel2,alignItems:'center',justifyContent:'center'},initial:{color:C.text,fontSize:34,fontWeight:'900'},body:{flex:1,paddingTop:4},nameRow:{flexDirection:'row',alignItems:'center',gap:5},name:{color:C.text,fontSize:21,fontWeight:'900',flexShrink:1},verified:{color:C.blue2,fontSize:14,fontWeight:'900'},role:{color:C.text,fontSize:13,fontWeight:'700',marginTop:3},location:{color:C.muted,fontSize:9,marginTop:7},availability:{alignSelf:'flex-start',height:27,paddingHorizontal:9,borderRadius:R.pill,marginTop:8,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:5},statusDot:{width:7,height:7,borderRadius:4},availabilityTxt:{color:C.text,fontSize:8,fontWeight:'800'},bio:{color:C.muted,fontSize:10.5,lineHeight:16,marginTop:12},
 highlights:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:11},highlight:{paddingHorizontal:9,paddingVertical:6,borderRadius:R.pill,backgroundColor:'rgba(139,92,246,.10)',borderWidth:1,borderColor:'rgba(139,92,246,.25)'},highlightTxt:{color:C.violetSoft,fontSize:8,fontWeight:'900'},pitchHero:{marginTop:12,borderRadius:16,overflow:'hidden',backgroundColor:C.panel2,borderWidth:1,borderColor:'rgba(139,92,246,.28)'},pitchHeroVideo:{width:'100%',aspectRatio:1.65,backgroundColor:C.panel2},pitchHeroBadge:{position:'absolute',top:9,left:9,borderRadius:R.pill,backgroundColor:'rgba(4,6,10,.76)',paddingHorizontal:8,paddingVertical:5},pitchHeroBadgeTxt:{color:C.violetSoft,fontSize:7,fontWeight:'900',letterSpacing:.8},pitchHeroCopy:{padding:10},pitchHeroTitle:{color:C.text,fontSize:11,fontWeight:'900'},pitchHeroMeta:{color:C.muted,fontSize:8,marginTop:3},metrics:{flexDirection:'row',marginTop:13,borderWidth:1,borderColor:C.lineSoft,borderRadius:14,overflow:'hidden'},metric:{flex:1,minHeight:58,alignItems:'center',justifyContent:'center',borderRightWidth:1,borderColor:C.lineSoft},metricN:{color:C.text,fontSize:16,fontWeight:'900'},metricL:{color:C.faint,fontSize:7.5,marginTop:3},actions:{flexDirection:'row',gap:7,marginTop:12},primary:{flex:1.25,height:46,borderRadius:14,backgroundColor:C.text,alignItems:'center',justifyContent:'center'},primaryTxt:{color:C.black,fontSize:9.5,fontWeight:'900'},secondary:{flex:1,height:46,borderRadius:14,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},following:{backgroundColor:'rgba(139,92,246,.08)',borderColor:'rgba(139,92,246,.35)'},secondaryTxt:{color:C.text,fontSize:9,fontWeight:'900'},saveCandidate:{height:40,borderRadius:12,borderWidth:1,borderColor:C.line,marginTop:8,alignItems:'center',justifyContent:'center'},saveCandidateOn:{borderColor:'rgba(139,92,246,.45)',backgroundColor:'rgba(139,92,246,.09)'},saveCandidateTxt:{color:C.muted,fontSize:8.5,fontWeight:'900'},saveCandidateTxtOn:{color:C.violetSoft},
 tabs:{flexDirection:'row',borderBottomWidth:1,borderColor:C.lineSoft,marginTop:14},tab:{flex:1,paddingVertical:12,borderBottomWidth:2,borderColor:'transparent',alignItems:'center'},tabOn:{borderColor:C.violetSoft},tabTxt:{color:C.faint,fontSize:9,fontWeight:'800'},tabTxtOn:{color:C.text},section:{marginTop:11,borderRadius:17,borderWidth:1,borderColor:C.lineSoft,backgroundColor:C.panel,padding:12},sectionHead:{flexDirection:'row',justifyContent:'space-between',marginBottom:9},sectionTitle:{color:C.text,fontSize:13,fontWeight:'900'},count:{color:C.faint,fontSize:8,fontWeight:'800'},
 verifiedList:{gap:7},workVerified:{borderRadius:14,borderWidth:1,borderColor:'rgba(71,226,154,.25)',backgroundColor:'rgba(71,226,154,.05)',padding:10},workVerifiedHead:{flexDirection:'row',alignItems:'center',gap:9},check:{width:30,height:30,borderRadius:15,backgroundColor:'rgba(71,226,154,.12)',alignItems:'center',justifyContent:'center'},checkTxt:{color:C.green,fontSize:14,fontWeight:'900'},workVerifiedTitle:{color:C.text,fontSize:10,fontWeight:'900'},workVerifiedCompany:{color:C.muted,fontSize:8,marginTop:2},workVerifiedStatus:{color:C.green,fontSize:7,fontWeight:'900'},workVerifiedMeta:{color:C.faint,fontSize:7.5,marginTop:8},proofBox:{minHeight:72,borderRadius:14,borderWidth:1,borderColor:C.line,backgroundColor:C.panel2,padding:11,flexDirection:'row',alignItems:'center'},proofK:{color:C.violetSoft,fontSize:7.5,fontWeight:'900',letterSpacing:.8},proofT:{color:C.text,fontSize:9.5,lineHeight:14,marginTop:4},proofBtn:{width:38,height:38,borderRadius:19,backgroundColor:C.text,alignItems:'center',justifyContent:'center'},proofArrow:{color:C.black,fontSize:24},
 chips:{flexDirection:'row',flexWrap:'wrap',gap:6},chip:{borderWidth:1,borderColor:C.line,borderRadius:R.pill,paddingHorizontal:10,paddingVertical:7,backgroundColor:C.panel2},chipTxt:{color:C.text,fontSize:8,fontWeight:'800'},grid:{flexDirection:'row',flexWrap:'wrap',gap:7},cred:{width:'48.8%',minHeight:74,borderRadius:13,borderWidth:1,borderColor:C.line,backgroundColor:C.panel2,padding:9},credTitle:{color:C.text,fontSize:9,fontWeight:'900'},credMeta:{color:C.muted,fontSize:7.5,marginTop:4},credYears:{color:C.faint,fontSize:7,marginTop:2},certMark:{color:C.green,fontSize:13,fontWeight:'900',marginBottom:4},empty:{minHeight:76,borderWidth:1,borderStyle:'dashed',borderColor:C.line,borderRadius:14,alignItems:'center',justifyContent:'center',paddingHorizontal:18,marginTop:11},emptyTxt:{color:C.faint,fontSize:9,textAlign:'center'},
 portfolio:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:12},workCard:{width:'48.8%',borderWidth:1,borderColor:C.lineSoft,borderRadius:15,backgroundColor:C.panel,overflow:'hidden',paddingBottom:9},media:{width:'100%',aspectRatio:.78,backgroundColor:C.panel2},mediaPh:{alignItems:'center',justifyContent:'center'},play:{color:C.violetSoft,fontSize:28},workTitle:{color:C.text,fontSize:9,fontWeight:'900',paddingHorizontal:8,marginTop:8},workMeta:{color:C.faint,fontSize:7,paddingHorizontal:8,marginTop:3},reviewList:{gap:8,marginTop:12},review:{borderRadius:15,borderWidth:1,borderColor:C.lineSoft,backgroundColor:C.panel,padding:12},reviewName:{color:C.text,fontSize:10,fontWeight:'900'},stars:{color:C.amber,fontSize:10,marginTop:4},reviewBody:{color:C.muted,fontSize:9,lineHeight:15,marginTop:6},report:{height:44,alignItems:'center',justifyContent:'center',marginTop:16},reportTxt:{color:C.red,fontSize:9,fontWeight:'900'}
});