import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getMessages, sendMessage } from '../lib/api';
import { supabase } from '../lib/supabase';
import { C } from '../lib/theme';

export default function ChatScreen({navigation,route}:any){
 const {conversationId,other}=route.params||{}; const [items,setItems]=useState<any[]>([]); const [text,setText]=useState(''); const [me,setMe]=useState('');
 useEffect(()=>{supabase.auth.getUser().then(({data})=>setMe(data.user?.id||''));getMessages(conversationId).then((r:any)=>setItems(Array.isArray(r)?r:[])).catch(()=>setItems([]))},[conversationId]);
 const send=async()=>{const body=text.trim();if(!body)return;setText('');const optimistic={id:`local-${Date.now()}`,body,sender_id:me,created_at:new Date().toISOString()};setItems(p=>[optimistic,...p]);try{const msg=await sendMessage(conversationId,body);setItems(p=>[msg,...p.filter(x=>x.id!==optimistic.id)])}catch{}}
 return <KeyboardAvoidingView style={s.page} behavior={Platform.OS==='ios'?'padding':undefined}>
   <View style={s.head}><TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹</Text></TouchableOpacity><View style={{flex:1}}><Text style={s.name}>{other?.full_name||'WORKIT member'}</Text><Text style={s.sub}>Work conversation</Text></View></View>
   <FlatList style={s.list} contentContainerStyle={s.messages} data={items} inverted keyExtractor={(x:any,i)=>x.id||String(i)} renderItem={({item}:any)=>{const mine=item.sender_id===me;return <View style={[s.bubble,mine?s.mine:s.theirs]}><Text style={[s.body,mine&&s.mineTxt]}>{item.body||'🎬 Video message'}</Text></View>}}/>
   <View style={s.composer}><TextInput value={text} onChangeText={setText} placeholder="Message about the work..." placeholderTextColor={C.faint} style={s.input} multiline/><TouchableOpacity onPress={send} style={s.send}><Text style={s.sendTxt}>↑</Text></TouchableOpacity></View>
 </KeyboardAvoidingView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},head:{paddingTop:52,paddingHorizontal:16,paddingBottom:12,borderBottomWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:12},back:{color:C.text,fontSize:31,fontWeight:'300'},name:{color:C.text,fontSize:15,fontWeight:'900'},sub:{color:C.muted,fontSize:9,marginTop:2},list:{flex:1},messages:{padding:16,gap:8},bubble:{maxWidth:'82%',paddingHorizontal:13,paddingVertical:10,borderRadius:16,marginVertical:3},mine:{alignSelf:'flex-end',backgroundColor:C.text,borderBottomRightRadius:5},theirs:{alignSelf:'flex-start',backgroundColor:C.panel2,borderBottomLeftRadius:5},body:{color:C.text,fontSize:12,lineHeight:18},mineTxt:{color:'#050505'},composer:{paddingHorizontal:12,paddingVertical:10,borderTopWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'flex-end',gap:8,backgroundColor:C.bg},input:{flex:1,minHeight:44,maxHeight:110,borderRadius:16,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,color:C.text,paddingHorizontal:13,paddingVertical:11,fontSize:12},send:{width:44,height:44,borderRadius:14,backgroundColor:C.text,alignItems:'center',justifyContent:'center'},sendTxt:{color:'#050505',fontSize:20,fontWeight:'900'}});
