import React,{useEffect,useState}from'react';
import{View,Text,ScrollView,TouchableOpacity,StyleSheet,Alert,Image}from'react-native';
import{createOrder,getMarketItem,openConversation,sendMessage}from'../lib/api';
import{C}from'../lib/theme';

export default function MarketDetailScreen({route,navigation}:any){
 const{id}=route.params;const[item,setItem]=useState<any>(null);const[busy,setBusy]=useState(false);
 useEffect(()=>{getMarketItem(id).then(setItem).catch(()=>Alert.alert('Could not load listing'))},[id]);
 if(!item)return<View style={s.page}/>;
 const message=async()=>{const c=await openConversation(item.seller.id);navigation.navigate('Chat',{conversationId:c.id,other:item.seller})};
 const start=async()=>{setBusy(true);try{const order=await createOrder(item.id);const c=await openConversation(item.seller.id);await sendMessage(c.id,`[WORKIT_ORDER:${order.id}] ORDER STARTED\n\n${item.title}\n${item.currency||'EUR'} ${item.price_amount!=null?Number(item.price_amount).toFixed(0):'Quote'}\n\nLet’s confirm the details here. Payment collection will be enabled with the WORKIT payment rollout.`);navigation.navigate('Chat',{conversationId:c.id,other:item.seller})}catch{Alert.alert('Could not start order','Please try again.')}finally{setBusy(false)}};
 return<ScrollView style={s.page} contentContainerStyle={s.content}>
  <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹ Back</Text></TouchableOpacity>
  {item.media_url?<Image source={{uri:item.media_url}} style={s.hero}/>:<View style={[s.hero,s.ph]}><Text style={s.phTxt}>WORKIT</Text></View>}
  <Text style={s.type}>{String(item.type).toUpperCase()}</Text><Text style={s.h1}>{item.title}</Text>
  <Text style={s.seller}>{item.seller?.full_name||'WORKIT professional'} {item.seller?.verified?'✓':''}</Text>
  <Text style={s.rating}>★ {Number(item.seller?.rating||0).toFixed(1)} · {item.seller?.review_count||0} verified reviews</Text>
  <Text style={s.desc}>{item.description||'Professional WORKIT listing.'}</Text>
  <View style={s.priceRow}><Text style={s.price}>{item.currency||'EUR'} {item.price_amount!=null?Number(item.price_amount).toFixed(0):'Quote'}</Text><Text style={s.remote}>{item.is_remote?'Remote available':'Local / on-site'}</Text></View>
  <TouchableOpacity style={s.primary} onPress={start} disabled={busy}><Text style={s.primaryTxt}>{busy?'Starting…':item.type==='teach'?'Book / start learning':item.type==='service'?'Start booking':'Start order'}</Text></TouchableOpacity>
  <TouchableOpacity style={s.secondary} onPress={message}><Text style={s.secondaryTxt}>Message professional</Text></TouchableOpacity>
 </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{padding:18,paddingTop:54,paddingBottom:80},back:{color:C.muted,fontSize:13,fontWeight:'800'},hero:{height:280,borderRadius:24,marginTop:18,backgroundColor:C.panel},ph:{alignItems:'center',justifyContent:'center'},phTxt:{color:C.faint,fontSize:28,fontWeight:'900'},type:{color:C.green,fontSize:9,fontWeight:'900',letterSpacing:1.1,marginTop:20},h1:{color:C.text,fontSize:27,fontWeight:'900',lineHeight:33,marginTop:7},seller:{color:C.text,fontSize:13,fontWeight:'800',marginTop:12},rating:{color:C.amber,fontSize:10,fontWeight:'800',marginTop:5},desc:{color:C.muted,fontSize:13,lineHeight:21,marginTop:18},priceRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:22,paddingVertical:16,borderTopWidth:1,borderBottomWidth:1,borderColor:C.line},price:{color:C.text,fontSize:22,fontWeight:'900'},remote:{color:C.muted,fontSize:10,fontWeight:'700'},primary:{height:54,borderRadius:16,backgroundColor:C.text,alignItems:'center',justifyContent:'center',marginTop:20},primaryTxt:{color:'#000',fontSize:13,fontWeight:'900'},secondary:{height:50,borderRadius:16,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginTop:9},secondaryTxt:{color:C.text,fontSize:12,fontWeight:'900'}});