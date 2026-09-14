import React,{useEffect,useState}from'react';
import{ScrollView,StyleSheet,Text,TouchableOpacity,View}from'react-native';
import{getEarnings}from'../lib/api';
import{C}from'../lib/theme';

export default function EarningsScreen({navigation}:any){
 const[data,setData]=useState<any>(null);const[loading,setLoading]=useState(true);
 useEffect(()=>{getEarnings().then(setData).catch(()=>setData({currency:'EUR',gross:0,net:0,orders:0})).finally(()=>setLoading(false))},[]);
 const money=(n:number)=>`${data?.currency||'EUR'} ${Number(n||0).toFixed(2)}`;const gross=Number(data?.gross||0);const net=Number(data?.net||0);const fees=Math.max(0,gross-net);const orders=Number(data?.orders||0);
 return<ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
  <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>← Back</Text></TouchableOpacity>
  <Text style={s.kicker}>WORKIT EARNINGS</Text><Text style={s.h1}>Your work. Your income.</Text><Text style={s.lead}>Track recorded marketplace revenue, platform fees and net earnings from completed WORKIT orders.</Text>
  <View style={s.hero}><Text style={s.heroLabel}>RECORDED NET EARNINGS</Text><Text style={s.heroN}>{loading?'—':money(net)}</Text><Text style={s.heroHint}>This is transaction tracking, not a withdrawable balance. Payouts activate only when WORKIT payments go live.</Text></View>
  <View style={s.grid}><Metric l="Gross revenue" v={loading?'—':money(gross)}/><Metric l="Net earnings" v={loading?'—':money(net)}/><Metric l="WORKIT fees" v={loading?'—':money(fees)}/><Metric l="Completed orders" v={loading?'—':String(orders)}/></View>
  <View style={s.info}><Text style={s.infoK}>PAYMENTS STATUS</Text><Text style={s.infoT}>Tracking is live. Money movement is not.</Text><Text style={s.infoB}>WORKIT records order economics today, but does not collect or pay out funds in this beta. Dedicated payment infrastructure and production terms will be enabled separately.</Text></View>
 </ScrollView>
}
const Metric=({l,v}:{l:string,v:string})=><View style={s.metric}><Text style={s.metricL}>{l}</Text><Text style={s.metricV}>{v}</Text></View>;
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{paddingTop:52,paddingHorizontal:18,paddingBottom:80},back:{color:C.muted,fontSize:12,fontWeight:'800',marginBottom:24},kicker:{color:C.green,fontSize:9,fontWeight:'900',letterSpacing:1.3},h1:{color:C.text,fontSize:31,fontWeight:'900',letterSpacing:-1.2,marginTop:6},lead:{color:C.muted,fontSize:13,lineHeight:20,marginTop:7},hero:{marginTop:22,borderRadius:24,padding:21,backgroundColor:'#0E1512',borderWidth:1,borderColor:'#1D3329'},heroLabel:{color:C.green,fontSize:8,fontWeight:'900',letterSpacing:1.1},heroN:{color:C.text,fontSize:34,fontWeight:'900',letterSpacing:-1.2,marginTop:9},heroHint:{color:C.muted,fontSize:10,lineHeight:16,marginTop:7},grid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:12},metric:{width:'48.7%',minHeight:94,borderRadius:18,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,padding:15,justifyContent:'space-between'},metricL:{color:C.faint,fontSize:9,fontWeight:'800',textTransform:'uppercase'},metricV:{color:C.text,fontSize:17,fontWeight:'900',marginTop:10},info:{marginTop:18,borderRadius:22,borderWidth:1,borderColor:'#20263A',backgroundColor:'#101217',padding:18},infoK:{color:C.blue2,fontSize:8,fontWeight:'900',letterSpacing:1},infoT:{color:C.text,fontSize:17,fontWeight:'900',lineHeight:22,marginTop:7},infoB:{color:C.muted,fontSize:12,lineHeight:19,marginTop:7}});
