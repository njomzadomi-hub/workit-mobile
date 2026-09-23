import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { getMe } from '../lib/api';
import { C, F, R, S, shadow } from '../lib/theme';

const fallbackQualifications = [
  { degree: 'Add qualification', institution: 'Show your education or professional training', years: '' },
];
const fallbackCertifications = [
  { name: 'Add certification', issuer: 'Verified credentials build trust' },
];

export default function ProfileScreen({ navigation }: any){
  const [p,setP]=useState<any>(null);
  const [section,setSection]=useState<'about'|'portfolio'|'reviews'|'services'|'activity'>('about');
  useEffect(()=>{getMe().then(setP).catch(console.warn)},[]);

  const qualifications = useMemo(()=>Array.isArray(p?.qualifications)&&p.qualifications.length?p.qualifications:fallbackQualifications,[p]);
  const certifications = useMemo(()=>Array.isArray(p?.certifications)&&p.certifications.length?p.certifications:fallbackCertifications,[p]);
  const tools = useMemo(()=>Array.isArray(p?.tools)&&p.tools.length?p.tools:[],[p]);
  const skills = useMemo(()=>Array.isArray(p?.skills)&&p.skills.length?p.skills:[],[p]);

  if(!p)return <View style={s.page}/>;
  const initials=(p.full_name||'W').split(' ').map((x:string)=>x[0]).join('').slice(0,2).toUpperCase();
  const rating=Number(p.rating||0);
  const response=p.response_time_minutes?`${p.response_time_minutes < 60 ? p.response_time_minutes+' min' : Math.round(p.response_time_minutes/60)+' hr'}`:'Fast replies';

  return <ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.topRow}>
      <TouchableOpacity onPress={()=>navigation.getParent()?.navigate('MainTabs',{screen:'Feed'})} activeOpacity={.8}>
        <Text style={s.wordmark}>WORK<Text style={s.wordmarkIT}>IT</Text></Text>
        <Text style={s.tagline}>THE WORLD'S BIGGEST WORK BAZAAR</Text>
      </TouchableOpacity>
      <View style={s.topActions}>
        <TouchableOpacity onPress={()=>navigation.getParent()?.navigate('GlobalSearch')} style={s.iconBtn}><Text style={s.icon}>⌕</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.getParent()?.navigate('Notifications')} style={s.iconBtn}><Text style={s.icon}>♢</Text><View style={s.alertDot}/></TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Settings')} style={s.iconBtn}><Text style={s.menu}>•••</Text></TouchableOpacity>
      </View>
    </View>

    <View style={s.heroCard}>
      <View style={s.identityRow}>
        <View style={s.avatarWrap}>
          {p.avatar_url?<Image source={{uri:p.avatar_url}} style={s.avatar}/>:<View style={[s.avatar,s.avatarPh]}><Text style={s.avatarTxt}>{initials}</Text></View>}
          <View style={s.availability}><View style={s.online}/><Text style={s.availabilityTxt}>{p.available_for_work?'Available for work':'Not available'}</Text></View>
        </View>
        <View style={s.identityBody}>
          <View style={s.nameRow}><Text numberOfLines={1} style={s.name}>{p.full_name||'WORKIT professional'}</Text>{p.verified&&<Text style={s.verified}>✓</Text>}</View>
          <Text style={s.title}>{p.title||'Professional'}</Text>
          <Text style={s.location}>⌖ {p.location||'Global'}  ·  ◉ Works globally</Text>
          {!!p.bio&&<Text numberOfLines={3} style={s.bio}>{p.bio}</Text>}
        </View>
      </View>

      <View style={s.statGrid}>
        <Stat n={p.completed_jobs||0} l="Completed jobs"/>
        <Stat n={p.follower_count||0} l="Followers"/>
        <Stat n={p.repeat_client_count||0} l="Repeat clients"/>
      </View>
      <View style={s.trustRow}>
        <Trust icon="★" big={rating?rating.toFixed(1):'New'} small={p.review_count?`${p.review_count} reviews`:'Build reviews'}/>
        <Trust icon="⚡" big={response} small="Typical response"/>
        <Trust icon="●" big={p.available_for_work?'Available now':'Unavailable'} small="Work status" green={p.available_for_work}/>
      </View>

      <View style={s.actions}>
        <TouchableOpacity style={s.primary} onPress={()=>navigation.navigate('Settings',{section:'profile'})}><Text style={s.primaryIcon}>▣</Text><Text style={s.primaryTxt}>Edit profile</Text></TouchableOpacity>
        <TouchableOpacity style={s.secondary} onPress={()=>navigation.getParent()?.navigate('Inbox')}><Text style={s.secondaryTxt}>Message</Text></TouchableOpacity>
        <TouchableOpacity style={s.secondary} onPress={()=>navigation.navigate('Hiring')}><Text style={s.secondaryTxt}>Hiring</Text></TouchableOpacity>
      </View>
    </View>

    <View style={s.tabs}>
      {(['about','portfolio','reviews','services','activity'] as const).map(x=><TouchableOpacity key={x} onPress={()=>setSection(x)} style={[s.tab,section===x&&s.tabOn]}><Text style={[s.tabTxt,section===x&&s.tabTxtOn]}>{x[0].toUpperCase()+x.slice(1)}</Text></TouchableOpacity>)}
    </View>

    {section==='about' ? <>
      <InfoSection icon="▰" title="Qualifications" count={qualifications.length} onPress={()=>navigation.navigate('Settings',{section:'qualifications'})}>
        <View style={s.cardsRow}>{qualifications.slice(0,2).map((q:any,i:number)=><View key={i} style={s.credentialCard}><Text style={s.credentialMark}>▣</Text><View style={{flex:1}}><Text style={s.credentialTitle}>{q.degree||q.title||'Qualification'}</Text><Text style={s.credentialMeta}>{q.institution||q.school||'Institution'}</Text>{!!q.years&&<Text style={s.credentialYears}>{q.years}</Text>}</View></View>)}</View>
      </InfoSection>

      <InfoSection icon="✦" title="Certifications" count={certifications.length} onPress={()=>navigation.navigate('Settings',{section:'certifications'})}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontal}>{certifications.slice(0,5).map((c:any,i:number)=><View key={i} style={s.certCard}><Text style={s.certBadge}>{(c.name||'C')[0]}</Text><Text numberOfLines={2} style={s.certTitle}>{c.name||c.title||'Certification'}</Text><Text numberOfLines={1} style={s.certIssuer}>{c.issuer||'Issuer'}</Text></View>)}</ScrollView>
      </InfoSection>

      <InfoSection icon="▱" title="Tools & Software" count={tools.length} onPress={()=>navigation.navigate('Settings',{section:'tools'})}>
        {tools.length?<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontal}>{tools.map((tool:string,i:number)=><View key={`${tool}-${i}`} style={s.toolCard}><View style={s.toolLogo}><Text style={s.toolLogoTxt}>{tool.slice(0,2).toUpperCase()}</Text></View><Text numberOfLines={1} style={s.toolTxt}>{tool}</Text></View>)}</ScrollView>:<EmptyRow text="Add the software and tools you use professionally"/>}
      </InfoSection>

      <InfoSection icon="▥" title="Skills" count={skills.length} onPress={()=>navigation.navigate('Settings',{section:'skills'})}>
        {skills.length?<View style={s.skills}>{skills.map((skill:string,i:number)=><TouchableOpacity key={`${skill}-${i}`} onPress={()=>navigation.getParent()?.navigate('GlobalSearch',{skill})} style={s.skill}><Text style={s.skillTxt}>{skill}</Text></TouchableOpacity>)}</View>:<EmptyRow text="Add skills so clients and employers can find you"/>}
      </InfoSection>

      <View style={s.businessRow}>
        <TouchableOpacity style={s.businessCard} onPress={()=>navigation.navigate('Earnings')}><Text style={s.businessK}>EARNINGS</Text><Text style={s.businessT}>Your money</Text><Text style={s.businessA}>Open dashboard →</Text></TouchableOpacity>
        <TouchableOpacity style={s.businessCard} onPress={()=>navigation.navigate('Pricing')}><Text style={[s.businessK,{color:C.violetSoft}]}>WORKIT PRO</Text><Text style={s.businessT}>Grow faster</Text><Text style={s.businessA}>View plans →</Text></TouchableOpacity>
      </View>
    </> : <Placeholder section={section} navigation={navigation}/>} 

    <TouchableOpacity style={s.logout} onPress={()=>supabase.auth.signOut()}><Text style={s.logoutTxt}>Log out</Text></TouchableOpacity>
  </ScrollView>
}

const Stat=({n,l}:any)=><View style={s.stat}><Text style={s.statN}>{n??0}</Text><Text style={s.statL}>{l}</Text></View>;
const Trust=({icon,big,small,green}:any)=><View style={s.trust}><Text style={[s.trustIcon,green&&{color:C.green}]}>{icon}</Text><View><Text style={s.trustBig}>{big}</Text><Text style={s.trustSmall}>{small}</Text></View></View>;
const InfoSection=({icon,title,count,onPress,children}:any)=><View style={s.section}><TouchableOpacity onPress={onPress} style={s.sectionHead}><View style={s.sectionTitleRow}><Text style={s.sectionIcon}>{icon}</Text><Text style={s.sectionTitle}>{title}</Text></View><Text style={s.sectionCount}>{count} items  ›</Text></TouchableOpacity>{children}</View>;
const EmptyRow=({text}:{text:string})=><View style={s.empty}><Text style={s.emptyTxt}>{text}</Text></View>;
const Placeholder=({section,navigation}:any)=><View style={s.placeholder}><Text style={s.placeholderTitle}>{section[0].toUpperCase()+section.slice(1)}</Text><Text style={s.placeholderBody}>This area has its own WORKIT workflow and will show your real {section} data.</Text><TouchableOpacity onPress={()=>section==='services'?navigation.getParent()?.navigate('MainTabs',{screen:'Market'}):navigation.getParent()?.navigate('MainTabs',{screen:'Feed'})} style={s.placeholderBtn}><Text style={s.placeholderBtnTxt}>Open {section} →</Text></TouchableOpacity></View>;

const s=StyleSheet.create({
  page:{flex:1,backgroundColor:C.bg},content:{paddingTop:S.top,paddingHorizontal:S.pageX,paddingBottom:120},
  topRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},wordmark:{color:C.text,fontSize:30,fontFamily:F.display,fontWeight:'700',letterSpacing:-1.5},wordmarkIT:{color:C.violet2},tagline:{color:C.muted,fontSize:7,fontWeight:'700',letterSpacing:2,marginTop:-2},topActions:{flexDirection:'row',gap:7},iconBtn:{width:39,height:39,borderRadius:20,alignItems:'center',justifyContent:'center',position:'relative'},icon:{color:C.text,fontSize:24},menu:{color:C.text,fontSize:17,letterSpacing:2},alertDot:{position:'absolute',right:7,top:5,width:7,height:7,borderRadius:4,backgroundColor:C.red},
  heroCard:{marginTop:20,borderWidth:1,borderColor:C.lineSoft,borderRadius:R.lg,backgroundColor:C.glassStrong,padding:14,...shadow},identityRow:{flexDirection:'row',gap:13},avatarWrap:{width:118,height:132,position:'relative'},avatar:{width:118,height:132,borderRadius:19},avatarPh:{backgroundColor:C.panel2,alignItems:'center',justifyContent:'center'},avatarTxt:{color:C.text,fontFamily:F.display,fontSize:34},availability:{position:'absolute',left:7,right:7,bottom:7,height:29,borderRadius:R.pill,backgroundColor:'rgba(3,5,8,.82)',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6},online:{width:8,height:8,borderRadius:4,backgroundColor:C.green},availabilityTxt:{color:C.text,fontSize:8,fontWeight:'800'},identityBody:{flex:1,paddingTop:4},nameRow:{flexDirection:'row',alignItems:'center',gap:5},name:{color:C.text,fontSize:23,fontWeight:'900',letterSpacing:-.8,maxWidth:'87%'},verified:{color:C.blue2,fontSize:15,fontWeight:'900'},title:{color:C.text,fontSize:15,fontWeight:'700',marginTop:2},location:{color:C.muted,fontSize:10,marginTop:7},bio:{color:C.muted,fontSize:11,lineHeight:16,marginTop:8},
  statGrid:{flexDirection:'row',marginTop:14,borderWidth:1,borderColor:C.lineSoft,borderRadius:15,overflow:'hidden'},stat:{flex:1,minHeight:66,alignItems:'center',justifyContent:'center',borderRightWidth:1,borderColor:C.lineSoft},statN:{color:C.text,fontSize:18,fontWeight:'900'},statL:{color:C.muted,fontSize:8,textAlign:'center',marginTop:3},trustRow:{flexDirection:'row',gap:7,marginTop:9},trust:{flex:1,minHeight:57,borderWidth:1,borderColor:C.lineSoft,borderRadius:14,paddingHorizontal:9,flexDirection:'row',alignItems:'center',gap:7},trustIcon:{color:C.gold,fontSize:15},trustBig:{color:C.text,fontSize:10,fontWeight:'900'},trustSmall:{color:C.faint,fontSize:7,marginTop:2},
  actions:{flexDirection:'row',gap:8,marginTop:11},primary:{flex:1,height:48,borderRadius:14,backgroundColor:C.gold2,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8},primaryIcon:{color:C.black,fontSize:14},primaryTxt:{color:C.black,fontSize:11,fontWeight:'900'},secondary:{flex:1,height:48,borderRadius:14,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,alignItems:'center',justifyContent:'center'},secondaryTxt:{color:C.text,fontSize:10,fontWeight:'800'},
  tabs:{flexDirection:'row',marginTop:14,borderBottomWidth:1,borderColor:C.lineSoft,justifyContent:'space-between'},tab:{paddingHorizontal:8,paddingVertical:11,borderBottomWidth:2,borderColor:'transparent'},tabOn:{borderColor:C.gold},tabTxt:{color:C.faint,fontSize:9,fontWeight:'800'},tabTxtOn:{color:C.text},
  section:{marginTop:12,borderWidth:1,borderColor:C.lineSoft,borderRadius:18,backgroundColor:C.panel,padding:12},sectionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10},sectionTitleRow:{flexDirection:'row',alignItems:'center',gap:8},sectionIcon:{color:C.gold,fontSize:16},sectionTitle:{color:C.text,fontSize:15,fontWeight:'900'},sectionCount:{color:C.faint,fontSize:8,fontWeight:'700'},cardsRow:{flexDirection:'row',gap:7},credentialCard:{flex:1,minHeight:78,borderWidth:1,borderColor:C.line,borderRadius:13,backgroundColor:C.panel2,padding:9,flexDirection:'row',gap:8,alignItems:'center'},credentialMark:{width:31,height:31,borderRadius:16,textAlign:'center',textAlignVertical:'center',color:C.text,backgroundColor:C.panel3},credentialTitle:{color:C.text,fontSize:10,fontWeight:'900'},credentialMeta:{color:C.muted,fontSize:8,marginTop:3},credentialYears:{color:C.faint,fontSize:7,marginTop:2},horizontal:{gap:8,paddingRight:5},certCard:{width:135,minHeight:82,borderWidth:1,borderColor:C.line,borderRadius:13,backgroundColor:C.panel2,padding:9},certBadge:{width:30,height:30,borderRadius:9,textAlign:'center',textAlignVertical:'center',backgroundColor:'#242B36',color:C.gold,fontSize:15,fontWeight:'900'},certTitle:{color:C.text,fontSize:9,fontWeight:'800',marginTop:7},certIssuer:{color:C.faint,fontSize:7,marginTop:3},toolCard:{width:75,minHeight:84,borderWidth:1,borderColor:C.line,borderRadius:13,backgroundColor:C.panel2,padding:8,alignItems:'center',justifyContent:'center'},toolLogo:{width:39,height:39,borderRadius:11,backgroundColor:'#171E2B',alignItems:'center',justifyContent:'center'},toolLogoTxt:{color:C.violetSoft,fontSize:12,fontWeight:'900'},toolTxt:{color:C.text,fontSize:8,fontWeight:'700',marginTop:7,maxWidth:65},skills:{flexDirection:'row',flexWrap:'wrap',gap:7},skill:{borderWidth:1,borderColor:C.line,borderRadius:R.pill,backgroundColor:C.panel2,paddingHorizontal:11,paddingVertical:7},skillTxt:{color:C.text,fontSize:8,fontWeight:'700'},empty:{minHeight:58,borderRadius:12,borderWidth:1,borderStyle:'dashed',borderColor:C.line,alignItems:'center',justifyContent:'center',padding:12},emptyTxt:{color:C.faint,fontSize:9,textAlign:'center'},
  businessRow:{flexDirection:'row',gap:8,marginTop:12},businessCard:{flex:1,minHeight:98,borderRadius:17,borderWidth:1,borderColor:C.lineSoft,backgroundColor:C.panel,padding:13},businessK:{color:C.green,fontSize:7,fontWeight:'900',letterSpacing:1},businessT:{color:C.text,fontSize:14,fontWeight:'900',marginTop:8},businessA:{color:C.muted,fontSize:9,fontWeight:'700',marginTop:15},placeholder:{marginTop:14,minHeight:180,borderRadius:19,borderWidth:1,borderColor:C.lineSoft,backgroundColor:C.panel,padding:18},placeholderTitle:{color:C.text,fontFamily:F.display,fontSize:24},placeholderBody:{color:C.muted,fontSize:11,lineHeight:17,marginTop:7},placeholderBtn:{marginTop:18,height:44,borderRadius:12,backgroundColor:C.violet3,alignItems:'center',justifyContent:'center'},placeholderBtnTxt:{color:C.white,fontSize:10,fontWeight:'900'},logout:{height:46,borderRadius:14,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginTop:18},logoutTxt:{color:C.red,fontSize:10,fontWeight:'800'}
});
