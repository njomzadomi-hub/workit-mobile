import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getFeed } from '../lib/api';
import { C, R, postMeta } from '../lib/theme';

const categories = ['For you', 'Builders', 'Creators', 'Trades', 'Food & Farm', 'Teachers', 'Local'];

export default function ExploreScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('For you');

  useEffect(() => { getFeed().then(r => setItems(r.items || [])).catch(console.warn); }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((x:any) => `${x.title} ${x.description} ${x.author?.full_name} ${x.author?.title}`.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.headRow}>
        <View><Text style={s.kicker}>DISCOVER TALENT</Text><Text style={s.h1}>Explore work.</Text></View>
        <View style={s.globe}><Text style={s.globeTxt}>◎</Text></View>
      </View>

      <View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="People, skills, services, work..." placeholderTextColor={C.faint} style={s.searchInput}/></View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {categories.map(c => <TouchableOpacity key={c} onPress={()=>setCategory(c)} style={[s.chip, category===c && s.chipOn]}><Text style={[s.chipTxt, category===c && s.chipTxtOn]}>{c}</Text></TouchableOpacity>)}
      </ScrollView>

      <View style={s.sectionRow}><Text style={s.section}>People doing real work</Text><Text style={s.link}>See all</Text></View>
      <View style={s.grid}>
        {filtered.slice(0,8).map((item:any, i:number) => {
          const meta = postMeta[item.type] || postMeta.video;
          return <TouchableOpacity key={item.id || i} style={s.card} activeOpacity={.88}>
            {item.thumbnail_url ? <Image source={{uri:item.thumbnail_url}} style={s.cardImg}/> : <View style={[s.cardImg,s.ph]}><Text style={s.phTxt}>WORKIT</Text></View>}
            <View style={s.fade}/>
            <View style={[s.type,{borderColor:meta.accent}]}><Text style={[s.typeTxt,{color:meta.accent}]}>{meta.label}</Text></View>
            <View style={s.cardInfo}>
              <Text numberOfLines={1} style={s.cardName}>{item.author?.full_name || 'WORKIT creator'}</Text>
              <Text numberOfLines={1} style={s.cardRole}>{item.author?.title || item.title}</Text>
            </View>
          </TouchableOpacity>
        })}
      </View>

      <View style={s.banner}><Text style={s.bannerEyebrow}>THE WORLD'S BIGGEST WORK BAZAAR</Text><Text style={s.bannerTitle}>Skill is everywhere. Opportunity should be too.</Text><Text style={s.bannerBody}>From coders to carpenters, farmers to founders — discover people by seeing what they can actually do.</Text></View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page:{flex:1,backgroundColor:C.bg}, content:{paddingTop:58,paddingHorizontal:18,paddingBottom:110},
  headRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, kicker:{color:C.blue2,fontSize:10,fontWeight:'800',letterSpacing:1.5}, h1:{color:C.text,fontSize:30,fontWeight:'800',letterSpacing:-1.2,marginTop:4},
  globe:{width:40,height:40,borderRadius:20,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,alignItems:'center',justifyContent:'center'}, globeTxt:{color:C.text,fontSize:22},
  search:{height:52,borderRadius:16,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,marginTop:20,flexDirection:'row',alignItems:'center',paddingHorizontal:15}, searchIcon:{color:C.muted,fontSize:22,marginRight:8}, searchInput:{flex:1,color:C.text,fontSize:14},
  chips:{gap:8,paddingVertical:16}, chip:{paddingHorizontal:14,paddingVertical:8,borderRadius:R.pill,borderWidth:1,borderColor:C.line,backgroundColor:C.panel}, chipOn:{backgroundColor:C.text,borderColor:C.text}, chipTxt:{color:C.muted,fontSize:12,fontWeight:'700'}, chipTxtOn:{color:'#000'},
  sectionRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:6,marginBottom:12}, section:{color:C.text,fontSize:17,fontWeight:'800'}, link:{color:C.blue2,fontSize:12,fontWeight:'700'},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:8}, card:{width:'48.8%',aspectRatio:.72,borderRadius:18,overflow:'hidden',backgroundColor:C.panel,position:'relative'}, cardImg:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'}, ph:{alignItems:'center',justifyContent:'center',backgroundColor:C.panel2}, phTxt:{color:C.faint,fontWeight:'900',letterSpacing:2}, fade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.16)'},
  type:{position:'absolute',top:10,left:10,borderWidth:1,backgroundColor:'rgba(0,0,0,.55)',borderRadius:R.pill,paddingHorizontal:8,paddingVertical:4}, typeTxt:{fontSize:8,fontWeight:'900',letterSpacing:.6}, cardInfo:{position:'absolute',left:11,right:11,bottom:11}, cardName:{color:'#fff',fontSize:13,fontWeight:'800'}, cardRole:{color:'rgba(255,255,255,.68)',fontSize:10,marginTop:2},
  banner:{marginTop:22,borderRadius:24,padding:22,backgroundColor:'#101217',borderWidth:1,borderColor:'#20263A'}, bannerEyebrow:{color:C.blue2,fontSize:9,fontWeight:'900',letterSpacing:1.2}, bannerTitle:{color:C.text,fontSize:22,fontWeight:'800',lineHeight:28,marginTop:8}, bannerBody:{color:C.muted,fontSize:13,lineHeight:20,marginTop:8}
});
