import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet, Image, Share } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { getFeed, likePost } from '../lib/api';
import { C, F, R, postMeta } from '../lib/theme';
import { demoFeed } from '../lib/demoData';

const { height: H } = Dimensions.get('window');
const FEED_H = H - 80;

export default function FeedScreen({navigation}:any) {
  const [items,setItems]=useState<any[]>(demoFeed); const [cursor,setCursor]=useState<string|null>(null); const [activeIdx,setActiveIdx]=useState(0); const [mode,setMode]=useState('For You');
  const load=async(c?:string)=>{try{const res=await getFeed(c);const fresh=res.items||[];setItems(p=>c?[...p,...fresh]:(fresh.length?fresh:demoFeed));setCursor(res.nextCursor)}catch(e){if(!c)setItems(demoFeed)}};
  useEffect(()=>{load()},[]);
  const onViewable=useRef(({viewableItems}:any)=>{if(viewableItems[0])setActiveIdx(viewableItems[0].index)}).current;
  const like=async(id:string,idx:number)=>{setItems(p=>p.map((x,i)=>i===idx?{...x,like_count:(x.like_count||0)+1}:x));if(id.startsWith('demo-'))return;try{await likePost(id)}catch{}};
  const rootNav=()=>navigation.getParent();
  const openProfessional=(item:any)=>{const username=item.author?.username;if(username)rootNav()?.navigate('Professional',{username,profile:item.author})};
  const act=(item:any)=>{
    if(['service','product','teach'].includes(item.type)&&item.market_item_id) return rootNav()?.navigate('MarketDetail',{id:item.market_item_id});
    if(item.type==='job') return rootNav()?.navigate('JobDetail',{jobId:item.id});
    return openProfessional(item);
  };
  const share=async(item:any)=>{try{await Share.share({message:`${item.title||'See this work'} — ${item.author?.full_name||'WORKIT professional'} on WORKIT`})}catch{}};

  return <View style={s.root}>
    <View style={s.top}>
      <View><Text style={s.wordmark}>WORK<Text style={s.wordmarkIT}>IT</Text></Text><Text style={s.tagline}>THE WORLD'S BIGGEST WORK BAZAAR</Text></View>
      <View style={s.topIcons}><TouchableOpacity onPress={()=>rootNav()?.navigate('GlobalSearch')} style={s.topIcon}><Text style={s.topIconTxt}>⌕</Text></TouchableOpacity><TouchableOpacity onPress={()=>rootNav()?.navigate('Notifications')} style={s.topIcon}><Text style={s.topIconTxt}>♢</Text><View style={s.alertDot}/></TouchableOpacity></View>
    </View>
    <View style={s.modes}>{['For You','Following'].map(x=><TouchableOpacity key={x} onPress={()=>setMode(x)} style={[s.modeBtn,mode===x&&s.modeBtnOn]}><Text style={[s.mode,mode===x&&s.modeOn]}>{x}</Text></TouchableOpacity>)}</View>

    <FlatList data={items} keyExtractor={(i,idx)=>i.id||String(idx)} pagingEnabled showsVerticalScrollIndicator={false} snapToInterval={FEED_H} decelerationRate="fast" onViewableItemsChanged={onViewable} viewabilityConfig={{itemVisiblePercentThreshold:60}} onEndReached={()=>cursor&&load(cursor)} onEndReachedThreshold={2}
      renderItem={({item,index})=>{const meta=postMeta[item.type]||postMeta.video;return <View style={s.card}>
        {item.cf_playback_url?<Video source={{uri:item.cf_playback_url}} style={StyleSheet.absoluteFill} resizeMode={ResizeMode.COVER} shouldPlay={index===activeIdx} isLooping/>:item.thumbnail_url?<Image source={{uri:item.thumbnail_url}} style={StyleSheet.absoluteFill} resizeMode="cover"/>:<View style={[StyleSheet.absoluteFill,s.fallback]}><Text style={s.fallbackTxt}>WORK<Text style={{color:C.violet2}}>IT</Text></Text></View>}
        <View style={s.scrim}/><View style={s.bottomFade}/>
        <View style={[s.badge,{borderColor:meta.accent}]}><Text style={[s.badgeTxt,{color:meta.accent}]}>{meta.label}</Text></View>
        <View style={s.side}>
          <TouchableOpacity onPress={()=>openProfessional(item)} style={s.avatarRing}>{item.author?.avatar_url?<Image source={{uri:item.author.avatar_url}} style={s.avatar}/>:<Text style={s.avatarLetter}>{item.author?.full_name?.[0]||'W'}</Text>}</TouchableOpacity>
          <TouchableOpacity onPress={()=>like(item.id,index)} style={s.action}><Text style={s.actionIcon}>♥</Text><Text style={s.actionN}>{item.like_count||0}</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>rootNav()?.navigate('Comments',{postId:item.id})} style={s.action}><Text style={s.actionIcon}>◌</Text><Text style={s.actionN}>{item.comment_count||0}</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>share(item)} style={s.action}><Text style={s.actionIcon}>↗</Text><Text style={s.actionN}>Share</Text></TouchableOpacity>
        </View>
        <View style={s.info}>
          <TouchableOpacity onPress={()=>openProfessional(item)}><Text style={s.name}>{item.author?.full_name||'WORKIT member'} {item.author?.verified?'✓':''}</Text><Text style={s.role}>{item.author?.title||'Professional'} · View profile</Text></TouchableOpacity>
          <Text style={s.title}>{item.title||'See my work'}</Text>{!!item.description&&<Text numberOfLines={2} style={s.desc}>{item.description}</Text>}
          {!!item.tags?.length&&<View style={s.tags}>{item.tags.slice(0,4).map((t:string)=><View key={t} style={s.tag}><Text style={s.tagTxt}>{t}</Text></View>)}</View>}
          <TouchableOpacity onPress={()=>act(item)} style={s.cta}><Text style={s.ctaTxt}>{meta.cta}</Text><Text style={s.ctaArrow}>→</Text></TouchableOpacity>
          <Text style={s.truth}>REAL PEOPLE · REAL WORK · A BIGGER WORLD</Text>
        </View>
      </View>}}
    />
  </View>
}

const s=StyleSheet.create({
 root:{flex:1,backgroundColor:C.bg},top:{height:74,position:'absolute',top:0,left:0,right:0,zIndex:30,paddingHorizontal:17,paddingTop:12,flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},wordmark:{color:C.text,fontSize:28,fontFamily:F.display,fontWeight:'700',letterSpacing:-1.3},wordmarkIT:{color:C.violet2},tagline:{color:'rgba(255,255,255,.72)',fontSize:6.5,fontWeight:'800',letterSpacing:1.7,marginTop:-1},topIcons:{flexDirection:'row',gap:5},topIcon:{width:38,height:38,borderRadius:19,alignItems:'center',justifyContent:'center',position:'relative'},topIconTxt:{color:C.text,fontSize:24},alertDot:{position:'absolute',right:6,top:3,width:7,height:7,borderRadius:4,backgroundColor:C.red},
 modes:{position:'absolute',top:82,left:16,right:115,zIndex:25,height:50,borderRadius:25,borderWidth:1,borderColor:'rgba(255,255,255,.24)',backgroundColor:'rgba(8,10,14,.52)',padding:3,flexDirection:'row'},modeBtn:{flex:1,borderRadius:22,alignItems:'center',justifyContent:'center'},modeBtnOn:{backgroundColor:'rgba(255,255,255,.16)',borderWidth:1,borderColor:'rgba(255,255,255,.22)'},mode:{color:'rgba(255,255,255,.55)',fontSize:12,fontWeight:'700'},modeOn:{color:C.white,fontWeight:'900'},
 card:{height:FEED_H,backgroundColor:'#090909'},fallback:{backgroundColor:'#0A0D12',alignItems:'center',justifyContent:'center'},fallbackTxt:{color:'#303747',fontFamily:F.display,fontSize:44,fontWeight:'700',letterSpacing:1},scrim:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,.12)'},bottomFade:{position:'absolute',left:0,right:0,bottom:0,height:360,backgroundColor:'rgba(0,0,0,.34)'},badge:{position:'absolute',top:145,left:17,borderWidth:1,borderRadius:R.pill,paddingHorizontal:10,paddingVertical:5,backgroundColor:'rgba(4,6,9,.62)'},badgeTxt:{fontSize:8,fontWeight:'900',letterSpacing:.9},
 side:{position:'absolute',right:14,bottom:205,alignItems:'center',gap:18},avatarRing:{width:47,height:47,borderRadius:24,borderWidth:2,borderColor:'#fff',backgroundColor:C.panel2,alignItems:'center',justifyContent:'center',overflow:'hidden'},avatar:{width:'100%',height:'100%'},avatarLetter:{color:C.white,fontWeight:'900'},action:{alignItems:'center'},actionIcon:{color:C.white,fontSize:25,fontWeight:'700'},actionN:{color:C.white,fontSize:9,fontWeight:'700',marginTop:2},
 info:{position:'absolute',left:17,right:78,bottom:24},name:{color:C.white,fontSize:16,fontWeight:'900'},role:{color:'rgba(255,255,255,.76)',fontSize:10,marginTop:2},title:{color:C.white,fontFamily:F.display,fontSize:22,lineHeight:27,marginTop:11},desc:{color:'rgba(255,255,255,.82)',fontSize:11,lineHeight:17,marginTop:4},tags:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:9},tag:{paddingHorizontal:9,paddingVertical:5,borderRadius:R.pill,backgroundColor:'rgba(11,15,22,.62)',borderWidth:1,borderColor:'rgba(255,255,255,.18)'},tagTxt:{color:C.white,fontSize:8},cta:{height:48,borderRadius:15,marginTop:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,backgroundColor:'#EEF2FF'},ctaTxt:{color:C.black,fontSize:12,fontWeight:'900'},ctaArrow:{color:C.black,fontSize:19,fontWeight:'700'},truth:{color:'rgba(255,255,255,.44)',fontSize:7,fontWeight:'900',letterSpacing:1.2,marginTop:9}
});
