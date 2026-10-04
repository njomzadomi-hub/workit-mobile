import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { addComment, getComments } from '../lib/api';
import { C, F, S } from '../lib/theme';

export default function CommentsScreen({navigation,route}:any){
 const postId=route?.params?.postId; const [items,setItems]=useState<any[]>([]); const [body,setBody]=useState(''); const [sending,setSending]=useState(false);
 const load=()=>postId&&getComments(postId).then(r=>setItems(r.items||[])).catch(()=>setItems([]));
 useEffect(()=>{load()},[postId]);
 const send=async()=>{const clean=body.trim();if(!clean||!postId||sending)return;setSending(true);try{await addComment(postId,clean);setBody('');await load()}catch{}setSending(false)};
 return <KeyboardAvoidingView style={s.page} behavior={Platform.OS==='ios'?'padding':undefined}>
   <View style={s.head}><TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹</Text></TouchableOpacity><Text style={s.title}>Comments</Text></View>
   <ScrollView style={{flex:1}} contentContainerStyle={s.list} keyboardShouldPersistTaps="handled">
     {items.length?items.map((c:any,i:number)=><View key={c.id||i} style={s.row}><View style={s.avatar}><Text style={s.avatarTxt}>{c.author?.full_name?.[0]||'W'}</Text></View><View style={{flex:1}}><Text style={s.name}>{c.author?.full_name||'WORKIT member'} {c.author?.verified?'✓':''}</Text><Text style={s.body}>{c.body}</Text><Text style={s.time}>{formatTime(c.created_at)}</Text></View></View>):<View style={s.empty}><Text style={s.emptyTitle}>Start the conversation.</Text><Text style={s.emptyBody}>Questions and feedback about this work will appear here.</Text></View>}
   </ScrollView>
   <View style={s.composer}><TextInput value={body} onChangeText={setBody} placeholder="Add a comment…" placeholderTextColor={C.faint} style={s.input} multiline/><TouchableOpacity onPress={send} style={[s.send,(!body.trim()||sending)&&{opacity:.5}]}><Text style={s.sendTxt}>Post</Text></TouchableOpacity></View>
 </KeyboardAvoidingView>
}
function formatTime(v?:string){if(!v)return'';const d=new Date(v);const diff=Date.now()-d.getTime();const m=Math.max(1,Math.floor(diff/60000));return m<60?`${m}m`:m<1440?`${Math.floor(m/60)}h`:`${Math.floor(m/1440)}d`}
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg,paddingTop:S.top},head:{height:48,paddingHorizontal:S.pageX,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderColor:C.lineSoft},back:{color:C.text,fontSize:34,lineHeight:36},title:{color:C.text,fontFamily:F.display,fontSize:24},list:{paddingHorizontal:S.pageX,paddingBottom:20},row:{flexDirection:'row',gap:10,paddingVertical:14,borderBottomWidth:1,borderColor:C.lineSoft},avatar:{width:36,height:36,borderRadius:18,backgroundColor:C.panel2,alignItems:'center',justifyContent:'center'},avatarTxt:{color:C.text,fontWeight:'900'},name:{color:C.text,fontSize:11,fontWeight:'900'},body:{color:C.muted,fontSize:11,lineHeight:17,marginTop:4},time:{color:C.faint,fontSize:8,marginTop:5},empty:{minHeight:240,alignItems:'center',justifyContent:'center',padding:30},emptyTitle:{color:C.text,fontFamily:F.display,fontSize:22},emptyBody:{color:C.muted,fontSize:10,textAlign:'center',lineHeight:16,marginTop:7},composer:{padding:10,paddingHorizontal:S.pageX,borderTopWidth:1,borderColor:C.lineSoft,backgroundColor:C.glassStrong,flexDirection:'row',alignItems:'flex-end',gap:8},input:{flex:1,maxHeight:100,minHeight:44,borderRadius:14,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,paddingHorizontal:12,paddingVertical:11,color:C.text,fontSize:11},send:{height:44,paddingHorizontal:16,borderRadius:14,backgroundColor:C.violet3,alignItems:'center',justifyContent:'center'},sendTxt:{color:C.white,fontSize:10,fontWeight:'900'}});
