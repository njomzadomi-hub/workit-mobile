import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getEarnings } from '../lib/api';
import { C } from '../lib/theme';

export default function EarningsScreen({ navigation }: any) {
  const [data,setData]=useState<any>(null);
  useEffect(()=>{getEarnings().then(setData).catch(()=>setData({currency:'EUR',gross_revenue:0,workit_fees:0,net_earnings:0,available_earnings:0,order_count:0,completed_orders:0}))},[]);
  const money=(n:number)=>`${data?.currency||'EUR'} ${Number(n||0).toFixed(2)}`;
  return <ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>← Back</Text></TouchableOpacity>
    <Text style={s.kicker}>WORKIT EARNINGS</Text><Text style={s.h1}>Your work. Your income.</Text><Text style={s.lead}>Track what customers paid, WORKIT fees and what you earned from completed work.</Text>
    <View style={s.hero}><Text style={s.heroLabel}>AVAILABLE EARNINGS</Text><Text style={s.heroN}>{money(data?.available_earnings)}</Text><Text style={s.heroHint}>Payout activation will appear here when WORKIT payments go live.</Text></View>
    <View style={s.grid}><Metric l="Gross revenue" v={money(data?.gross_revenue)}/><Metric l="Net earnings" v={money(data?.net_earnings)}/><Metric l="WORKIT fees" v={money(data?.workit_fees)}/><Metric l="Orders" v={String(data?.order_count||0)}/><Metric l="Completed" v={String(data?.completed_orders||0)}/></View>
    <View style={s.info}><Text style={s.infoK}>HOW WORKIT EARNS</Text><Text style={s.infoT}>You keep the majority of every transaction.</Text><Text style={s.infoB}>WORKIT charges a platform fee when it creates economic value — a booking, service, product or lesson sold through the platform. Pro plans can reduce that fee.</Text></View>
  </ScrollView>
}
const Metric=({l,v}:{l:string,v:string})=><View style={s.metric}><Text style={s.metricL}>{l}</Text><Text style={s.metricV}>{v}</Text></View>;
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{paddingTop:52,paddingHorizontal:18,paddingBottom:80},back:{color:C.muted,fontSize:12,fontWeight:'800',marginBottom:24},kicker:{color:C.green,fontSize:9,fontWeight:'900',letterSpacing:1.3},h1:{color:C.text,fontSize:31,fontWeight:'900',letterSpacing:-1.2,marginTop:6},lead:{color:C.muted,fontSize:13,lineHeight:20,marginTop:7},hero:{marginTop:22,borderRadius:24,padding:21,backgroundColor:'#0E1512',borderWidth:1,borderColor:'#1D3329'},heroLabel:{color:C.green,fontSize:8,fontWeight:'900',letterSpacing:1.1},heroN:{color:C.text,fontSize:34,fontWeight:'900',letterSpacing:-1.2,marginTop:9},heroHint:{color:C.muted,fontSize:10,lineHeight:16,marginTop:7},grid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:12},metric:{width:'48.7%',minHeight:94,borderRadius:18,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,padding:15,justifyContent:'space-between'},metricL:{color:C.faint,fontSize:9,fontWeight:'800',textTransform:'uppercase'},metricV:{color:C.text,fontSize:17,fontWeight:'900',marginTop:10},info:{marginTop:18,borderRadius:22,borderWidth:1,borderColor:'#20263A',backgroundColor:'#101217',padding:18},infoK:{color:C.blue2,fontSize:8,fontWeight:'900',letterSpacing:1},infoT:{color:C.text,fontSize:17,fontWeight:'900',lineHeight:22,marginTop:7},infoB:{color:C.muted,fontSize:12,lineHeight:19,marginTop:7}});