import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getFeed, searchTalent } from '../lib/api';
import { C, R, postMeta } from '../lib/theme';
import { demoFeed } from '../lib/demoData';

const professions = ['Barber','Hair Stylist','Welder','Electrician','Plumber','Carpenter','Farmer','Chef','Teacher','Nurse','Dentist','Architect','Developer','Designer','Accountant','Driver','Mechanic','Cleaner','Photographer','Personal Trainer'];
const categories = ['All', 'Trades', 'Beauty', 'Construction', 'Hospitality', 'Healthcare', 'Education', 'Tech', 'Creative', 'Agriculture'];

export default function ExploreScreen() {
  const [items, setItems] = useState<any[]>(demoFeed);
  const [talent, setTalent] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [profession, setProfession] = useState('');
  const [category, setCategory] = useState('All');
  const [mode, setMode] = useState<'discover'|'hire'>('discover');
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => { getFeed().then(r => setItems((r.items || []).length ? r.items : demoFeed)).catch(()=>setItems(demoFeed)); }, []);

  useEffect(() => {
    if (mode !== 'hire') return;
    const timer = setTimeout(() => {
      searchTalent({ query, profession, available: availableOnly, limit: 30 })
        .then(r => setTalent(r.items || []))
        .catch(() => setTalent([]));
    }, 250);
    return () => clearTimeout(timer);
  }, [mode, query, profession, availableOnly]);

  const filtered = useMemo(() => {
    let base = items;
    if (profession) base = base.filter((x:any) => `${x.author?.title} ${x.title}`.toLowerCase().includes(profession.toLowerCase()));
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter((x:any) => `${x.title} ${x.description} ${x.author?.full_name} ${x.author?.title}`.toLowerCase().includes(q));
  }, [items, query, profession]);

  return (
    <ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.headRow}>
        <View><Text style={s.kicker}>{mode==='hire'?'FIND WORKERS':'DISCOVER WORK'}</Text><Text style={s.h1}>{mode==='hire'?'Hire by profession.':'Explore work.'}</Text></View>
        <View style={s.globe}><Text style={s.globeTxt}>◎</Text></View>
      </View>

      <View style={s.modeWrap}>
        <TouchableOpacity onPress={()=>setMode('discover')} style={[s.modeBtn,mode==='discover'&&s.modeOn]}><Text style={[s.modeTxt,mode==='discover'&&s.modeTxtOn]}>Discover work</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>setMode('hire')} style={[s.modeBtn,mode==='hire'&&s.modeOn]}><Text style={[s.modeTxt,mode==='hire'&&s.modeTxtOn]}>Find workers</Text></TouchableOpacity>
      </View>

      <View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder={mode==='hire'?'Search barber, welder, nurse, developer...':'People, projects, skills, services...'} placeholderTextColor={C.faint} style={s.searchInput}/></View>

      <Text style={s.label}>PROFESSIONS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.professions}>
        {professions.map(p => <TouchableOpacity key={p} onPress={()=>setProfession(profession===p?'':p)} style={[s.prof, profession===p&&s.profOn]}><Text style={[s.profTxt,profession===p&&s.profTxtOn]}>{p}</Text></TouchableOpacity>)}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {categories.map(c => <TouchableOpacity key={c} onPress={()=>setCategory(c)} style={[s.chip, category===c && s.chipOn]}><Text style={[s.chipTxt, category===c && s.chipTxtOn]}>{c}</Text></TouchableOpacity>)}
      </ScrollView>

      {mode==='hire' ? <>
        <View style={s.hireControls}><View><Text style={s.section}>Available professionals</Text><Text style={s.hint}>Search by profession, skill, name or location.</Text></View><TouchableOpacity onPress={()=>setAvailableOnly(v=>!v)} style={[s.available,availableOnly&&s.availableOn]}><Text style={[s.availableTxt,availableOnly&&s.availableTxtOn]}>{availableOnly?'Available now':'All talent'}</Text></TouchableOpacity></View>
        <View style={s.talentList}>
          {(talent.length?talent:filtered.slice(0,8).map((x:any)=>({ ...x.author, skills:[x.author?.title], available_for_work:true, avatar_url:x.author?.avatar_url }))).map((p:any,i:number)=><TouchableOpacity key={p.id||i} style={s.talentCard} activeOpacity={.88}>
            {p.avatar_url?<Image source={{uri:p.avatar_url}} style={s.avatar}/>:<View style={[s.avatar,s.avatarPh]}><Text style={s.avatarLetter}>{p.full_name?.[0]||'W'}</Text></View>}
            <View style={s.talentBody}><View style={s.nameRow}><Text numberOfLines={1} style={s.talentName}>{p.full_name||'WORKIT professional'} {p.verified?'✓':''}</Text>{p.available_for_work&&<View style={s.liveDot}/>}</View><Text style={s.talentRole}>{p.title||profession||'Professional'}</Text><Text numberOfLines={1} style={s.meta}>{p.location||'Global'} {p.hourly_rate?`· €${p.hourly_rate}/hr`:''}</Text><View style={s.skillRow}>{(p.skills||[]).slice(0,3).map((sk:string)=><Text key={sk} style={s.skill}>{sk}</Text>)}</View></View>
            <View style={s.hireBtn}><Text style={s.hireBtnTxt}>View</Text></View>
          </TouchableOpacity>)}
        </View>
      </> : <>
        <View style={s.sectionRow}><Text style={s.section}>People doing real work</Text><Text style={s.link}>Global ↗</Text></View>
        <View style={s.grid}>
          {filtered.slice(0,10).map((item:any, i:number) => {
            const meta = postMeta[item.type] || postMeta.video;
            return <TouchableOpacity key={item.id || i} style={s.card} activeOpacity={.88}>
              {item.thumbnail_url ? <Image source={{uri:item.thumbnail_url}} style={s.cardImg}/> : <View style={[s.cardImg,s.ph]}><Text style={s.phTxt}>WORKIT</Text></View>}
              <View style={s.fade}/><View style={[s.type,{borderColor:meta.accent}]}><Text style={[s.typeTxt,{color:meta.accent}]}>{meta.label}</Text></View>
              <View style={s.cardInfo}><Text numberOfLines={1} style={s.cardName}>{item.author?.full_name || 'WORKIT creator'} {item.author?.verified?'✓':''}</Text><Text numberOfLines={1} style={s.cardRole}>{item.author?.title || item.title}</Text></View>
            </TouchableOpacity>
          })}
        </View>
      </>}

      <View style={s.banner}><Text style={s.bannerEyebrow}>THE WORLD'S BIGGEST WORK BAZAAR</Text><Text style={s.bannerTitle}>Find work. Find workers. Show what you can do.</Text><Text style={s.bannerBody}>WORKIT connects professional identity, proof of work, hiring and commerce in one video-first platform.</Text></View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page:{flex:1,backgroundColor:C.bg}, content:{paddingTop:58,paddingHorizontal:18,paddingBottom:110},
  headRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, kicker:{color:C.blue2,fontSize:10,fontWeight:'800',letterSpacing:1.5}, h1:{color:C.text,fontSize:30,fontWeight:'800',letterSpacing:-1.2,marginTop:4},
  globe:{width:40,height:40,borderRadius:20,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,alignItems:'center',justifyContent:'center'}, globeTxt:{color:C.text,fontSize:22},
  modeWrap:{flexDirection:'row',backgroundColor:C.panel,borderRadius:14,padding:4,marginTop:18,borderWidth:1,borderColor:C.line},modeBtn:{flex:1,paddingVertical:10,alignItems:'center',borderRadius:11},modeOn:{backgroundColor:C.text},modeTxt:{color:C.muted,fontSize:12,fontWeight:'800'},modeTxtOn:{color:'#050505'},
  search:{height:52,borderRadius:16,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,marginTop:12,flexDirection:'row',alignItems:'center',paddingHorizontal:15}, searchIcon:{color:C.muted,fontSize:22,marginRight:8}, searchInput:{flex:1,color:C.text,fontSize:14},
  label:{color:C.faint,fontSize:9,fontWeight:'900',letterSpacing:1.2,marginTop:18,marginBottom:9},professions:{gap:8,paddingBottom:4},prof:{paddingHorizontal:14,paddingVertical:9,borderRadius:R.pill,backgroundColor:'#111217',borderWidth:1,borderColor:'#272a36'},profOn:{backgroundColor:C.blue,borderColor:C.blue},profTxt:{color:'#B2B4C0',fontSize:11,fontWeight:'800'},profTxtOn:{color:'#fff'},
  chips:{gap:8,paddingVertical:14}, chip:{paddingHorizontal:13,paddingVertical:7,borderRadius:R.pill,borderWidth:1,borderColor:C.line,backgroundColor:C.panel}, chipOn:{backgroundColor:C.text,borderColor:C.text}, chipTxt:{color:C.muted,fontSize:11,fontWeight:'700'}, chipTxtOn:{color:'#000'},
  sectionRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:6,marginBottom:12}, section:{color:C.text,fontSize:17,fontWeight:'800'}, link:{color:C.blue2,fontSize:12,fontWeight:'700'},hint:{color:C.muted,fontSize:10,marginTop:3},
  hireControls:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:6,marginBottom:12},available:{paddingHorizontal:11,paddingVertical:7,borderRadius:R.pill,borderWidth:1,borderColor:C.line},availableOn:{backgroundColor:'#0F241D',borderColor:'#1F5C45'},availableTxt:{color:C.muted,fontSize:9,fontWeight:'800'},availableTxtOn:{color:C.green},talentList:{gap:9},talentCard:{minHeight:92,borderWidth:1,borderColor:C.line,borderRadius:18,backgroundColor:C.panel,padding:12,flexDirection:'row',alignItems:'center'},avatar:{width:58,height:58,borderRadius:16},avatarPh:{backgroundColor:C.panel2,alignItems:'center',justifyContent:'center'},avatarLetter:{color:C.text,fontSize:20,fontWeight:'900'},talentBody:{flex:1,marginLeft:11},nameRow:{flexDirection:'row',alignItems:'center',gap:6},talentName:{color:C.text,fontSize:14,fontWeight:'900',maxWidth:'92%'},talentRole:{color:C.blue2,fontSize:11,fontWeight:'700',marginTop:2},meta:{color:C.muted,fontSize:9,marginTop:3},liveDot:{width:7,height:7,borderRadius:4,backgroundColor:C.green},skillRow:{flexDirection:'row',gap:5,marginTop:7},skill:{color:C.muted,fontSize:8,fontWeight:'700',backgroundColor:C.panel2,paddingHorizontal:6,paddingVertical:3,borderRadius:6},hireBtn:{paddingHorizontal:12,paddingVertical:8,backgroundColor:C.text,borderRadius:10},hireBtnTxt:{color:'#000',fontSize:9,fontWeight:'900'},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:8}, card:{width:'48.8%',aspectRatio:.72,borderRadius:18,overflow:'hidden',backgroundColor:C.panel,position:'relative'}, cardImg:{position:'absolute',top:0,left:0,right:0,bottom:0,width:'100%',height:'100%'}, ph:{alignItems:'center',justifyContent:'center',backgroundColor:C.panel2}, phTxt:{color:C.faint,fontWeight:'900',letterSpacing:2}, fade:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,.18)'},type:{position:'absolute',top:10,left:10,borderWidth:1,backgroundColor:'rgba(0,0,0,.55)',borderRadius:R.pill,paddingHorizontal:8,paddingVertical:4}, typeTxt:{fontSize:8,fontWeight:'900',letterSpacing:.6}, cardInfo:{position:'absolute',left:11,right:11,bottom:11}, cardName:{color:'#fff',fontSize:13,fontWeight:'800'}, cardRole:{color:'rgba(255,255,255,.72)',fontSize:10,marginTop:2},
  banner:{marginTop:22,borderRadius:24,padding:22,backgroundColor:'#101217',borderWidth:1,borderColor:'#20263A'}, bannerEyebrow:{color:C.blue2,fontSize:9,fontWeight:'900',letterSpacing:1.2}, bannerTitle:{color:C.text,fontSize:22,fontWeight:'800',lineHeight:28,marginTop:8}, bannerBody:{color:C.muted,fontSize:13,lineHeight:20,marginTop:8}
});
