import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { getFeed, likePost } from '../lib/api';
import { C, R, postMeta } from '../lib/theme';
import { demoFeed } from '../lib/demoData';

const { height: H } = Dimensions.get('window');
const FEED_H = H - 74;

export default function FeedScreen() {
  const [items,setItems]=useState<any[]>(demoFeed); const [cursor,setCursor]=useState<string|null>(null); const [activeIdx,setActiveIdx]=useState(0); const [mode,setMode]=useState('For You');
  const load=async(c?:string)=>{try{const res=await getFeed(c);const fresh=res.items||[];setItems(p=>c?[...p,...fresh]:(fresh.length?fresh:demoFeed));setCursor(res.nextCursor)}catch(e){if(!c)setItems(demoFeed)}};
  useEffect(()=>{load()},[]);
  const onViewable=useRef(({viewableItems}:any)=>{if(viewableItems[0])setActiveIdx(viewableItems[0].index)}).current;
  const like=async(id:string,idx:number)=>{setItems(p=>p.map((x,i)=>i===idx?{...x,like_count:(x.like_count||0)+1}:x));if(id.startsWith('demo-'))return;try{await likePost(id)}catch{}};

  return <View style={s.root}>
    <View style={s.top}><Text style={s.wordmark}>WORK<Text style={{color:C.blue2}}>IT</Text></Text><View style={s.modes}>{['For You','Following'].map(x=><TouchableOpacity key={x} onPress={()=>setMode(x)}><Text style={[s.mode,mode===x&&s.modeOn]}>{x}</Text></TouchableOpacity>)}</View><Text style={s.inbox}>✦</Text></View>
    <FlatList data={items} keyExtractor={(i,idx)=>i.id||String(idx)} pagingEnabled showsVerticalScrollIndicator={false} snapToInterval={FEED_H} decelerationRate="fast" onViewableItemsChanged={onViewable} viewabilityConfig={{itemVisiblePercentThreshold:60}} onEndReached={()=>cursor&&load(cursor)} onEndReachedThreshold={2}
      renderItem={({item,index})=>{const meta=postMeta[item.type]||postMeta.video;return <View style={s.card}>
        {item.cf_playback_url?<Video source={{uri:item.cf_playback_url}} style={StyleSheet.absoluteFill} resizeMode={ResizeMode.COVER} shouldPlay={index===activeIdx} isLooping/>:item.thumbnail_url?<Image source={{uri:item.thumbnail_url}} style={StyleSheet.absoluteFill} resizeMode="cover"/>:<View style={[StyleSheet.absoluteFill,s.fallback]}><Text style={s.fallbackTxt}>WORKIT</Text></View>}
        <View style={s.scrim}/>
        <View style={[s.badge,{borderColor:meta.accent}]}><Text style={[s.badgeTxt,{color:meta.accent}]}>{meta.label}</Text></View>
        <View style={s.side}>
          <TouchableOpacity style={s.avatarRing}>{item.author?.avatar_url?<Image source={{uri:item.author.avatar_url}} style={s.avatar}/>:<Text style={s.avatarLetter}>{item.author?.full_name?.[0]||'W'}</Text>}</TouchableOpacity>
          <TouchableOpacity onPress={()=>like(item.id,index)} style={s.action}><Text style={s.actionIcon}>♥</Text><Text style={s.actionN}>{item.like_count||0}</Text></TouchableOpacity>
          <TouchableOpacity style={s.action}><Text style={s.actionIcon}>◌</Text><Text style={s.actionN}>{item.comment_count||0}</Text></TouchableOpacity>
          <TouchableOpacity style={s.action}><Text style={s.actionIcon}>↗</Text><Text style={s.actionN}>Share</Text></TouchableOpacity>
        </View>
        <View style={s.info}>
          <Text style={s.name}>{item.author?.full_name||'WORKIT member'} {item.author?.verified?'✓':''}</Text><Text style={s.role}>{item.author?.title||'Professional'} · View profile</Text>
          <Text style={s.title}>{item.title||'See my work'}</Text>{!!item.description&&<Text numberOfLines={2} style={s.desc}>{item.description}</Text>}
          <TouchableOpacity style={[s.cta,{backgroundColor:meta.accent}]}><Text style={s.ctaTxt}>{meta.cta}</Text><Text style={s.ctaArrow}>→</Text></TouchableOpacity>
          <Text style={s.truth}>REAL WORK • REAL PEOPLE • GLOBAL</Text>
        </View>
      </View>}}
    />
  </View>
}

const s=StyleSheet.create({
 root:{flex:1,backgroundColor:C.bg},top:{height:54,position:'absolute',top:0,left:0,right:0,zIndex:20,paddingHorizontal:16,paddingTop:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},wordmark:{color:'#fff',fontSize:19,fontWeight:'900',letterSpacing:-1},modes:{flexDirection:'row',gap:16},mode:{color:'rgba(255,255,255,.45)',fontSize:12,fontWeight:'800'},modeOn:{color:'#fff'},inbox:{color:'#fff',fontSize:19},
 card:{height:FEED_H,backgroundColor:'#090909'},fallback:{backgroundColor:'#111',alignItems:'center',justifyContent:'center'},fallbackTxt:{color:'#222',fontSize:44,fontWeight:'900',letterSpacing:4},scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.22)'},badge:{position:'absolute',top:64,left:16,borderWidth:1,borderRadius:R.pill,paddingHorizontal:10,paddingVertical:5,backgroundColor:'rgba(0,0,0,.5)'},badgeTxt:{fontSize:9,fontWeight:'900',letterSpacing:.9},
 side:{position:'absolute',right:14,bottom:172,alignItems:'center',gap:18},avatarRing:{width:46,height:46,borderRadius:23,borderWidth:2,borderColor:'#fff',backgroundColor:'#1A1A1D',alignItems:'center',justifyContent:'center',overflow:'hidden'},avatar:{width:'100%',height:'100%'},avatarLetter:{color:'#fff',fontWeight:'900'},action:{alignItems:'center'},actionIcon:{color:'#fff',fontSize:25,fontWeight:'700'},actionN:{color:'#fff',fontSize:9,fontWeight:'700',marginTop:2},
 info:{position:'absolute',left:16,right:78,bottom:24},name:{color:'#fff',fontSize:17,fontWeight:'900'},role:{color:'rgba(255,255,255,.65)',fontSize:11,marginTop:2},title:{color:'#fff',fontSize:18,fontWeight:'800',lineHeight:23,marginTop:13},desc:{color:'rgba(255,255,255,.76)',fontSize:12,lineHeight:18,marginTop:5},cta:{height:44,borderRadius:14,marginTop:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:15},ctaTxt:{color:'#070707',fontSize:13,fontWeight:'900'},ctaArrow:{color:'#070707',fontSize:18,fontWeight:'700'},truth:{color:'rgba(255,255,255,.35)',fontSize:8,fontWeight:'900',letterSpacing:1.1,marginTop:10}
});