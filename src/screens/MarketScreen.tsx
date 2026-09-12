import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { getFeed, getMarket, getSavedMarket, saveMarketItem, unsaveMarketItem } from '../lib/api';
import { C, F, R, S, postMeta } from '../lib/theme';
import { demoMarket } from '../lib/demoData';

export default function MarketScreen({navigation}:any){
  const [items,setItems]=useState<any[]>(demoMarket.map(x=>({...x,source:'demo'})));
  const [saved,setSaved]=useState<Set<string>>(new Set());
  const [tab,setTab]=useState('All'); const [query,setQuery]=useState(''); const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([getMarket().catch(()=>({items:[]})), getFeed().catch(()=>({items:[]})), getSavedMarket().catch(()=>({items:[]}))])
      .then(([market,feed,savedRes])=>{
        const commerce=(market.items||[]).map((x:any)=>({...x,source:'market',thumbnail_url:x.media_url,author:x.seller,price:x.price_amount}));
        const actionPosts=(feed.items||[]).filter((x:any)=>['job','donate'].includes(x.type)).map((x:any)=>({...x,source:'feed'}));
        const merged=[...commerce,...actionPosts]; setItems(merged.length?merged:demoMarket.map(x=>({...x,source:'demo'})));
        setSaved(new Set((savedRes.items||[]).map((x:any)=>x.id)));
      }).finally(()=>setLoading(false));
  },[]);

  const visible=useMemo(()=>items.filter(x=>{
    const tabOk=tab==='All'||x.type===tab.toLowerCase(); const q=query.trim().toLowerCase();
    const searchOk=!q||`${x.title} ${x.description||''} ${x.author?.full_name||x.seller?.full_name||''}`.toLowerCase().includes(q);
    return tabOk&&searchOk;
  }),[items,tab,query]);
  const rootNav=()=>navigation.getParent();
  const open=(item:any)=>{if(item.source==='market')return rootNav()?.navigate('MarketDetail',{id:item.id});if(item.type==='job')return rootNav()?.navigate('JobDetail',{jobId:item.id});if(item.author?.username)return rootNav()?.navigate('Professional',{username:item.author.username,profile:item.author})};
  const toggleSaved=async(item:any)=>{if(item.source!=='market')return;const isSaved=saved.has(item.id);setSaved(prev=>{const next=new Set(prev);isSaved?next.delete(item.id):next.add(item.id);return next});try{isSaved?await unsaveMarketItem(item.id):await saveMarketItem(item.id)}catch{setSaved(prev=>{const next=new Set(prev);isSaved?next.add(item.id):next.delete(item.id);return next})}};

  return <ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.top}><View><Text style={s.wordmark}>WORK<Text style={s.wordmarkIT}>IT</Text></Text><Text style={s.tagline}>THE WORLD'S BIGGEST WORK BAZAAR</Text></View><View style={s.topIcons}><TouchableOpacity onPress={()=>rootNav()?.navigate('GlobalSearch')}><Text style={s.topIcon}>⌕</Text></TouchableOpacity><TouchableOpacity onPress={()=>rootNav()?.navigate('Notifications')}><Text style={s.topIcon}>♢</Text></TouchableOpacity></View></View>
    <View style={s.hero}><Text style={s.heroK}>MARKET</Text><Text style={s.heroTitle}>Invest in your <Text style={{color:C.violet2}}>growth.</Text></Text><Text style={s.heroBody}>Book services, buy products, learn from experts — all in one trusted professional marketplace.</Text></View>
    <View style={s.segment}>{['Service','Product','Teach'].map(t=><TouchableOpacity key={t} onPress={()=>setTab(tab===t?'All':t)} style={[s.segmentBtn,tab===t&&s.segmentOn]}><Text style={[s.segmentTxt,tab===t&&s.segmentTxtOn]}>{t==='Teach'?'Courses':`${t}s`}</Text></TouchableOpacity>)}</View>
    <View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search services, products, courses or experts..." placeholderTextColor={C.faint} style={s.searchInput}/><TouchableOpacity onPress={()=>rootNav()?.navigate('GlobalSearch')}><Text style={s.filter}>☷</Text></TouchableOpacity></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{['All','Design','Development','Business','Marketing','Education','Creative'].map(c=><TouchableOpacity key={c} onPress={()=>c==='All'&&setTab('All')} style={[s.chip,c==='All'&&tab==='All'&&s.chipOn]}><Text style={[s.chipTxt,c==='All'&&tab==='All'&&s.chipTxtOn]}>{c}</Text></TouchableOpacity>)}</ScrollView>
    <View style={s.sectionRow}><View><Text style={s.section}>Featured on WORKIT</Text><Text style={s.sectionSub}>Verified professionals. Real results.</Text></View><Text style={s.count}>{visible.length} live</Text></View>
    <View style={s.grid}>{visible.map((item:any,i:number)=>{
      const meta=postMeta[item.type]||postMeta.service; const rawPrice=item.price_amount??item.price; const price=rawPrice!=null?`${item.currency||'EUR'} ${Number(rawPrice).toFixed(0)}`:'Quote'; const seller=item.author||item.seller; const isSaved=saved.has(item.id);
      return <TouchableOpacity onPress={()=>open(item)} key={`${item.source||'item'}-${item.id||i}`} style={s.card} activeOpacity={.88}>
        {item.thumbnail_url?<Image source={{uri:item.thumbnail_url}} style={s.image}/>:<View style={[s.image,s.imagePh]}><Text style={s.imagePhTxt}>W</Text></View>}
        {item.source==='market'&&<TouchableOpacity onPress={()=>toggleSaved(item)} style={[s.save,isSaved&&s.saveOn]}><Text style={s.saveTxt}>{isSaved?'♥':'♡'}</Text></TouchableOpacity>}
        <View style={[s.typePill,{borderColor:meta.accent}]}><Text style={[s.typeTxt,{color:meta.accent}]}>{meta.label}</Text></View>
        <View style={s.cardBody}><Text numberOfLines={2} style={s.title}>{item.title||'Work opportunity'}</Text><Text numberOfLines={2} style={s.desc}>{item.description||'Professional offer on WORKIT.'}</Text><Text numberOfLines={1} style={s.author}>{seller?.full_name||'WORKIT member'} {seller?.verified?'✓':''}</Text><Text style={s.rating}>★ {seller?.rating||'New'} {seller?.review_count?`(${seller.review_count})`:''}</Text><View style={s.cardBottom}><Text style={s.price}>{price}</Text><View style={s.cta}><Text style={s.ctaTxt}>{meta.cta}</Text></View></View></View>
      </TouchableOpacity>
    })}</View>
    {loading&&<Text style={s.sync}>Syncing live marketplace…</Text>}
  </ScrollView>
}

const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{paddingTop:S.top,paddingHorizontal:S.pageX,paddingBottom:110},top:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},wordmark:{color:C.text,fontFamily:F.display,fontSize:29,fontWeight:'700',letterSpacing:-1.4},wordmarkIT:{color:C.violet2},tagline:{color:C.muted,fontSize:6.5,fontWeight:'800',letterSpacing:1.8,marginTop:-1},topIcons:{flexDirection:'row',gap:14,paddingTop:2},topIcon:{color:C.text,fontSize:25},hero:{marginTop:24,paddingRight:24},heroK:{color:C.violetSoft,fontSize:8,fontWeight:'900',letterSpacing:1.5},heroTitle:{color:C.text,fontSize:31,fontWeight:'900',letterSpacing:-1.2,lineHeight:35,marginTop:5},heroBody:{color:C.muted,fontSize:12,lineHeight:18,marginTop:7},segment:{height:49,marginTop:18,borderRadius:24,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,flexDirection:'row',padding:3},segmentBtn:{flex:1,borderRadius:20,alignItems:'center',justifyContent:'center'},segmentOn:{backgroundColor:'rgba(255,255,255,.12)',borderWidth:1,borderColor:'rgba(255,255,255,.18)'},segmentTxt:{color:C.muted,fontSize:10,fontWeight:'800'},segmentTxtOn:{color:C.text},search:{height:54,borderRadius:17,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,marginTop:13,flexDirection:'row',alignItems:'center',paddingHorizontal:14},searchIcon:{color:C.text,fontSize:22,marginRight:8},searchInput:{flex:1,color:C.text,fontSize:12},filter:{color:C.muted,fontSize:20},chips:{gap:8,paddingVertical:15},chip:{paddingHorizontal:12,paddingVertical:8,borderRadius:R.pill,borderWidth:1,borderColor:C.line,backgroundColor:C.panel},chipOn:{backgroundColor:C.violet3,borderColor:C.violetSoft},chipTxt:{color:C.muted,fontSize:9,fontWeight:'800'},chipTxtOn:{color:C.white},sectionRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',marginTop:3,marginBottom:11},section:{color:C.text,fontSize:18,fontWeight:'900'},sectionSub:{color:C.muted,fontSize:9,marginTop:3},count:{color:C.violetSoft,fontSize:9,fontWeight:'800'},grid:{flexDirection:'row',flexWrap:'wrap',gap:9},card:{width:'48.7%',borderRadius:18,borderWidth:1,borderColor:C.lineSoft,backgroundColor:C.panel,overflow:'hidden',position:'relative'},image:{width:'100%',aspectRatio:1.15},imagePh:{backgroundColor:C.panel2,alignItems:'center',justifyContent:'center'},imagePhTxt:{color:C.violet2,fontFamily:F.display,fontSize:34},save:{position:'absolute',top:8,right:8,width:30,height:30,borderRadius:15,backgroundColor:'rgba(4,7,12,.76)',alignItems:'center',justifyContent:'center'},saveOn:{backgroundColor:'rgba(139,92,246,.84)'},saveTxt:{color:C.white,fontSize:18},typePill:{position:'absolute',top:8,left:8,paddingHorizontal:8,paddingVertical:4,borderRadius:R.pill,borderWidth:1,backgroundColor:'rgba(4,7,12,.72)'},typeTxt:{fontSize:7,fontWeight:'900'},cardBody:{padding:10},title:{color:C.text,fontSize:12,fontWeight:'900',lineHeight:16},desc:{color:C.muted,fontSize:8,lineHeight:12,marginTop:4},author:{color:C.text,fontSize:8,fontWeight:'800',marginTop:8},rating:{color:C.gold,fontSize:8,fontWeight:'800',marginTop:4},cardBottom:{marginTop:9,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},price:{color:C.text,fontSize:13,fontWeight:'900'},cta:{paddingHorizontal:9,paddingVertical:6,borderRadius:9,backgroundColor:'#EEF2FF'},ctaTxt:{color:C.black,fontSize:7.5,fontWeight:'900'},sync:{color:C.faint,fontSize:8,textAlign:'center',marginTop:12}});
