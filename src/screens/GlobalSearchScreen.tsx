import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getJobs, getMarket, searchTalent } from '../lib/api';
import { C, F, R, S } from '../lib/theme';

export default function GlobalSearchScreen({navigation,route}:any){
  const [q,setQ]=useState(route?.params?.skill||'');
  const [loading,setLoading]=useState(false);
  const [people,setPeople]=useState<any[]>([]); const [jobs,setJobs]=useState<any[]>([]); const [market,setMarket]=useState<any[]>([]);
  useEffect(()=>{const t=setTimeout(()=>run(),220);return()=>clearTimeout(t)},[q]);
  const run=async()=>{setLoading(true);try{const [p,j,m]=await Promise.all([searchTalent({query:q,limit:8}),getJobs({limit:8}),getMarket({q})]);setPeople(p.items||[]);setJobs((j.items||[]).filter((x:any)=>!q||`${x.title} ${x.company_name}`.toLowerCase().includes(q.toLowerCase())));setMarket(m.items||[])}catch{}setLoading(false)};
  return <ScrollView style={s.page} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <View style={s.head}><TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹</Text></TouchableOpacity><Text style={s.title}>Search WORKIT</Text></View>
    <View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput autoFocus value={q} onChangeText={setQ} placeholder="People, professions, jobs, skills, services..." placeholderTextColor={C.faint} style={s.input}/></View>
    {loading&&<Text style={s.loading}>Searching across WORKIT…</Text>}
    <Section t="People"><View style={s.stack}>{people.map((p:any)=><TouchableOpacity key={p.id} onPress={()=>navigation.navigate('Professional',{username:p.username,profile:p})} style={s.row}><View><Text style={s.rowTitle}>{p.full_name} {p.verified?'✓':''}</Text><Text style={s.rowSub}>{p.title||'Professional'} · {p.location||'Global'}</Text><Text numberOfLines={1} style={s.tags}>{[...(p.tools||[]),...(p.skills||[])].slice(0,4).join(' · ')}</Text></View><Text style={s.arrow}>›</Text></TouchableOpacity>)}</View></Section>
    <Section t="Jobs"><View style={s.stack}>{jobs.map((j:any)=><TouchableOpacity key={j.id} onPress={()=>navigation.navigate('JobDetail',{jobId:j.id})} style={s.row}><View><Text style={s.rowTitle}>{j.title}</Text><Text style={s.rowSub}>{j.company_name||'WORKIT company'} · {j.is_remote?'Remote':j.country_code||'On-site'}</Text></View><Text style={s.arrow}>›</Text></TouchableOpacity>)}</View></Section>
    <Section t="Market"><View style={s.stack}>{market.map((m:any)=><TouchableOpacity key={m.id} onPress={()=>navigation.navigate('MarketDetail',{id:m.id})} style={s.row}><View><Text style={s.rowTitle}>{m.title}</Text><Text style={s.rowSub}>{m.type} · {m.currency||'EUR'} {m.price_amount||0}</Text></View><Text style={s.arrow}>›</Text></TouchableOpacity>)}</View></Section>
  </ScrollView>
}
const Section=({t,children}:any)=><View style={{marginTop:22}}><Text style={s.kicker}>{t.toUpperCase()}</Text>{children}</View>;
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{paddingTop:S.top,paddingHorizontal:S.pageX,paddingBottom:80},head:{flexDirection:'row',alignItems:'center',gap:12},back:{color:C.text,fontSize:36,lineHeight:38},title:{color:C.text,fontFamily:F.display,fontSize:27},search:{height:56,marginTop:18,borderRadius:18,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,flexDirection:'row',alignItems:'center',paddingHorizontal:14},searchIcon:{color:C.text,fontSize:23,marginRight:8},input:{flex:1,color:C.text,fontSize:14},loading:{color:C.violetSoft,fontSize:9,fontWeight:'800',marginTop:9},kicker:{color:C.faint,fontSize:8,fontWeight:'900',letterSpacing:1.5,marginBottom:8},stack:{gap:8},row:{minHeight:72,borderRadius:15,borderWidth:1,borderColor:C.lineSoft,backgroundColor:C.panel,padding:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},rowTitle:{color:C.text,fontSize:13,fontWeight:'900'},rowSub:{color:C.muted,fontSize:9,marginTop:4},tags:{color:C.violetSoft,fontSize:8,marginTop:5,maxWidth:280},arrow:{color:C.text,fontSize:24}});
