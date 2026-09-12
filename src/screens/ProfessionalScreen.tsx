import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { getProfile, openConversation } from '../lib/api';
import { C } from '../lib/theme';

export default function ProfessionalScreen({route,navigation}:any){
 const {username}=route.params; const [p,setP]=useState<any>(null);
 useEffect(()=>{getProfile(username).then(setP).catch(()=>Alert.alert('Could not load professional'))},[username]);
 if(!p)return <View style={s.page}/>;
 const message=async()=>{const c=await openConversation(p.id);navigation.navigate('Chat',{conversationId:c.id,other:p})};
 return <ScrollView style={s.page} contentContainerStyle={s.content}>
   <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹ Back</Text></TouchableOpacity>
   <View style={s.hero}>{p.avatar_url?<Image source={{uri:p.avatar_url}} style={s.avatar}/>:<View style={[s.avatar,s.ph]}><Text style={s.initial}>{p.full_name?.[0]||'W'}</Text></View>}<Text style={s.name}>{p.full_name} {p.verified?'✓':''}</Text><Text style={s.title}>{p.title||'Professional'}</Text><Text style={s.location}>{p.location||'Global'}{p.available_for_work?' · Available for work':''}</Text></View>
   {!!p.bio&&<Text style={s.bio}>{p.bio}</Text>}
   <Text style={s.label}>SKILLS</Text><View style={s.skills}>{(p.skills||[]).map((x:string)=><Text key={x} style={s.skill}>{x}</Text>)}</View>
   <View style={s.stats}><View><Text style={s.statN}>{p.video_count||0}</Text><Text style={s.statL}>Work posts</Text></View><View><Text style={s.statN}>{p.follower_count||0}</Text><Text style={s.statL}>Followers</Text></View><View><Text style={s.statN}>{p.total_views||0}</Text><Text style={s.statL}>Views</Text></View></View>
   <TouchableOpacity style={s.primary} onPress={message}><Text style={s.primaryTxt}>Message / Hire</Text></TouchableOpacity>
 </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{padding:18,paddingTop:54,paddingBottom:80},back:{color:C.muted,fontSize:13,fontWeight:'800'},hero:{alignItems:'center',marginTop:28},avatar:{width:104,height:104,borderRadius:52},ph:{backgroundColor:C.panel,alignItems:'center',justifyContent:'center'},initial:{color:C.text,fontSize:38,fontWeight:'900'},name:{color:C.text,fontSize:25,fontWeight:'900',marginTop:15},title:{color:C.blue2,fontSize:13,fontWeight:'800',marginTop:5},location:{color:C.muted,fontSize:10,fontWeight:'700',marginTop:5},bio:{color:C.muted,fontSize:13,lineHeight:21,textAlign:'center',marginTop:22},label:{color:C.faint,fontSize:9,fontWeight:'900',letterSpacing:1.1,marginTop:28},skills:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:10},skill:{color:C.text,fontSize:9,fontWeight:'800',borderWidth:1,borderColor:C.line,borderRadius:999,paddingHorizontal:10,paddingVertical:6},stats:{flexDirection:'row',justifyContent:'space-around',borderTopWidth:1,borderBottomWidth:1,borderColor:C.line,paddingVertical:18,marginTop:28},statN:{color:C.text,fontSize:18,fontWeight:'900',textAlign:'center'},statL:{color:C.faint,fontSize:8,fontWeight:'800',marginTop:3,textTransform:'uppercase'},primary:{height:54,borderRadius:16,backgroundColor:C.text,alignItems:'center',justifyContent:'center',marginTop:24},primaryTxt:{color:'#000',fontSize:13,fontWeight:'900'}});