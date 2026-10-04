import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C, R } from '../lib/theme';

export default function PricingScreen({ navigation }: any) {
  const professional = [
    { key:'professional_free', name:'Professional Free', price:'€0', sub:'Start building your proof of work.', features:['Unlimited profile','Work videos & projects','Basic talent discovery'] },
    { key:'professional_pro', name:'WORKIT Pro', price:'€14.99', sub:'Draft launch pricing for professionals who want more discovery.', features:['Lower marketplace fee','Monthly boosts','Advanced analytics','Priority discovery','Pro profile tools'], featured:true },
  ];
  const employer = [
    { key:'employer_free', name:'Employer Free', price:'€0', sub:'Try WORKIT hiring.', features:['1 job post','Basic outreach','Basic talent search'] },
    { key:'employer_growth', name:'Employer Growth', price:'€49', sub:'Draft launch pricing for active hiring teams.', features:['More job posts','More outreach','Advanced talent filters','Candidate shortlist'], featured:true },
    { key:'employer_pro', name:'Employer Pro', price:'€149', sub:'Draft launch pricing for high-volume hiring.', features:['High-volume job posting','Expanded outreach','Priority distribution','Advanced hiring tools'] },
  ];

  const Card=({p}:any)=> <View style={[s.card,p.featured&&s.featured]}>
    {p.featured&&<Text style={s.best}>DRAFT RECOMMENDED PLAN</Text>}
    <Text style={s.name}>{p.name}</Text><Text style={s.price}>{p.price}<Text style={s.mo}>{p.price!=='€0'?' / month':''}</Text></Text>
    <Text style={s.sub}>{p.sub}</Text>
    <View style={s.features}>{p.features.map((f:string)=><Text key={f} style={s.feature}>✓  {f}</Text>)}</View>
    <View style={[s.cta,p.price==='€0'&&s.ctaFree]}><Text style={[s.ctaTxt,p.price==='€0'&&s.ctaTxtFree]}>{p.price==='€0'?'Free plan':'Payments not live yet'}</Text></View>
  </View>;

  return <ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>← Back</Text></TouchableOpacity>
    <Text style={s.kicker}>PRICING PREVIEW</Text><Text style={s.h1}>Grow your work.</Text><Text style={s.lead}>WORKIT is free to join during beta. Paid plans are a launch preview and cannot be purchased yet.</Text>
    <Text style={s.section}>For professionals</Text>{professional.map(p=><Card key={p.key} p={p}/>)}
    <Text style={s.section}>For employers</Text>{employer.map(p=><Card key={p.key} p={p}/>)}
    <Text style={s.note}>Final pricing and payments activate only after the dedicated WORKIT payment account and production terms are ready.</Text>
  </ScrollView>
}

const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{paddingTop:52,paddingHorizontal:18,paddingBottom:70},back:{color:C.muted,fontSize:12,fontWeight:'800',marginBottom:24},kicker:{color:C.blue2,fontSize:9,fontWeight:'900',letterSpacing:1.3},h1:{color:C.text,fontSize:31,fontWeight:'900',letterSpacing:-1.2,marginTop:6},lead:{color:C.muted,fontSize:13,lineHeight:20,marginTop:7,maxWidth:340},section:{color:C.text,fontSize:16,fontWeight:'900',marginTop:26,marginBottom:10},card:{borderWidth:1,borderColor:C.line,backgroundColor:C.panel,borderRadius:22,padding:18,marginBottom:10},featured:{borderColor:C.blue2,backgroundColor:'#101423'},best:{color:C.blue2,fontSize:8,fontWeight:'900',letterSpacing:1.1,marginBottom:8},name:{color:C.text,fontSize:18,fontWeight:'900'},price:{color:C.text,fontSize:28,fontWeight:'900',marginTop:10},mo:{fontSize:11,color:C.muted,fontWeight:'700'},sub:{color:C.muted,fontSize:12,lineHeight:18,marginTop:4},features:{gap:8,marginTop:15},feature:{color:C.text,fontSize:11,fontWeight:'700'},cta:{height:44,borderRadius:R.pill,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginTop:17,backgroundColor:C.panel},ctaFree:{backgroundColor:C.text,borderColor:C.text},ctaTxt:{color:C.muted,fontSize:11,fontWeight:'900'},ctaTxtFree:{color:'#050505'},note:{color:C.faint,fontSize:10,lineHeight:16,marginTop:16}});
