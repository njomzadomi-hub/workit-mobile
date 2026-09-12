import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getFeed, getMarket } from '../lib/api';
import { C, R, postMeta } from '../lib/theme';
import { demoMarket } from '../lib/demoData';

export default function MarketScreen(){
  const [items,setItems]=useState<any[]>(demoMarket.map(x=>({...x,source:'demo'})));
  const [tab,setTab]=useState('All');
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([getMarket().catch(()=>({items:[]})), getFeed().catch(()=>({items:[]}))])
      .then(([market,feed])=>{
        const commerce=(market.items||[]).map((x:any)=>({...x,source:'market',thumbnail_url:x.media_url,author:x.seller,price:x.price_amount}));
        const actionPosts=(feed.items||[]).filter((x:any)=>['job','donate'].includes(x.type)).map((x:any)=>({...x,source:'feed'}));
        const merged=[...commerce,...actionPosts];
        setItems(merged.length?merged:demoMarket.map(x=>({...x,source:'demo'})));
      }).finally(()=>setLoading(false));
  },[]);

  const visible=useMemo(()=>tab==='All'?items:items.filter(x=>x.type===tab.toLowerCase()),[items,tab]);

  return <ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <Text style={s.kicker}>WORKIT MARKET</Text><Text style={s.h1}>Buy work. Find work.</Text><Text style={s.sub}>Services, products, jobs and knowledge — directly from the people behind them.</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs}>
      {['All','Service','Product','Job','Teach','Donate'].map(t=><TouchableOpacity key={t} onPress={()=>setTab(t)} style={[s.tab,tab===t&&s.tabOn]}><Text style={[s.tabTxt,tab===t&&s.tabTxtOn]}>{t}</Text></TouchableOpacity>)}
    </ScrollView>
    <View style={s.feature}><View style={s.featureTop}><Text style={s.featureEyebrow}>IDENTITY + PROOF + TRANSACTION</Text><Text style={s.spark}>✦</Text></View><Text style={s.featureTitle}>See the person. See the work. Then transact.</Text><Text style={s.featureBody}>Every listing is tied to a real professional identity, and completed transactions become verified reputation.</Text></View>
    <View style={s.sectionRow}><Text style={s.section}>Fresh in the bazaar</Text><Text style={s.count}>{visible.length} listings</Text></View>
    {visible.map((item:any,i:number)=>{
      const meta=postMeta[item.type]||postMeta.service;
      const rawPrice=item.price_amount ?? item.price;
      const price=rawPrice!=null?`${item.currency||'EUR'} ${Number(rawPrice).toFixed(0)}`:null;
      const seller=item.author||item.seller;
      return <TouchableOpacity key={`${item.source||'item'}-${item.id||i}`} style={s.item} activeOpacity={.88}>
        {item.thumbnail_url?<Image source={{uri:item.thumbnail_url}} style={s.thumb}/>:<View style={[s.thumb,s.thumbPh]}><Text style={s.thumbPhTxt}>W</Text></View>}
        <View style={s.itemBody}><View style={s.itemTop}><Text style={[s.type,{color:meta.accent}]}>{meta.label}</Text><Text style={s.arrow}>↗</Text></View><Text numberOfLines={2} style={s.title}>{item.title||'Work opportunity'}</Text><Text numberOfLines={1} style={s.author}>{seller?.full_name||'WORKIT member'}{seller?.verified?' · Verified ✓':''}</Text>{seller?.rating&&<Text style={s.rating}>★ {seller.rating} · {seller.review_count||0} reviews</Text>}<View style={s.bottomRow}>{price?<Text style={s.price}>{price}</Text>:<View/>}<View style={[s.cta,{backgroundColor:meta.accent}]}><Text style={s.ctaTxt}>{meta.cta}</Text></View></View></View>
      </TouchableOpacity>
    })}
    {loading&&<Text style={s.sync}>Syncing live marketplace…</Text>}
  </ScrollView>
}

const s=StyleSheet.create({
 page:{flex:1,backgroundColor:C.bg},content:{paddingTop:58,paddingHorizontal:18,paddingBottom:110},kicker:{color:C.green,fontSize:10,fontWeight:'900',letterSpacing:1.5},h1:{color:C.text,fontSize:30,fontWeight:'800',letterSpacing:-1.2,marginTop:5},sub:{color:C.muted,fontSize:13,lineHeight:20,marginTop:7,maxWidth:340},
 tabs:{gap:8,paddingVertical:18},tab:{paddingHorizontal:14,paddingVertical:8,borderRadius:R.pill,borderWidth:1,borderColor:C.line,backgroundColor:C.panel},tabOn:{backgroundColor:C.text,borderColor:C.text},tabTxt:{color:C.muted,fontSize:12,fontWeight:'700'},tabTxtOn:{color:'#000'},
 feature:{borderRadius:24,padding:20,backgroundColor:'#0E1512',borderWidth:1,borderColor:'#1D3329',marginBottom:24},featureTop:{flexDirection:'row',justifyContent:'space-between'},featureEyebrow:{color:C.green,fontSize:8,fontWeight:'900',letterSpacing:1.1,maxWidth:'85%'},spark:{color:C.green,fontSize:18},featureTitle:{color:C.text,fontSize:22,fontWeight:'800',lineHeight:28,marginTop:12},featureBody:{color:C.muted,fontSize:13,lineHeight:20,marginTop:7},
 sectionRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:12},section:{color:C.text,fontSize:17,fontWeight:'800'},count:{color:C.faint,fontSize:10,fontWeight:'700'},item:{minHeight:150,borderRadius:20,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,overflow:'hidden',flexDirection:'row',marginBottom:10},thumb:{width:118,height:'100%'},thumbPh:{backgroundColor:C.panel2,alignItems:'center',justifyContent:'center'},thumbPhTxt:{color:C.blue2,fontSize:34,fontWeight:'900'},itemBody:{flex:1,padding:14},itemTop:{flexDirection:'row',justifyContent:'space-between'},type:{fontSize:9,fontWeight:'900',letterSpacing:.8},arrow:{color:C.faint,fontSize:16},title:{color:C.text,fontSize:15,fontWeight:'800',lineHeight:20,marginTop:5},author:{color:C.muted,fontSize:10,marginTop:5},rating:{color:C.amber,fontSize:9,fontWeight:'700',marginTop:4},bottomRow:{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},price:{color:C.text,fontSize:14,fontWeight:'900'},cta:{paddingHorizontal:12,paddingVertical:7,borderRadius:R.pill},ctaTxt:{color:'#000',fontSize:10,fontWeight:'900'},sync:{color:C.faint,fontSize:9,textAlign:'center',marginTop:8}
});