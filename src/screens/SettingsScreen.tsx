import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { C } from '../lib/theme';

const Row=({title,subtitle,onPress,danger=false}:any)=><TouchableOpacity onPress={onPress} style={s.row} activeOpacity={.82}><View style={{flex:1}}><Text style={[s.rowTitle,danger&&{color:C.red}]}>{title}</Text>{subtitle?<Text style={s.rowSub}>{subtitle}</Text>:null}</View><Text style={s.arrow}>›</Text></TouchableOpacity>;

export default function SettingsScreen({navigation}:any){
 return <ScrollView style={s.page} contentContainerStyle={s.content}>
   <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹ Profile</Text></TouchableOpacity>
   <Text style={s.kicker}>ACCOUNT & SAFETY</Text><Text style={s.h1}>Settings</Text>
   <Text style={s.section}>Safety</Text>
   <View style={s.card}>
     <Row title="Report a problem" subtitle="Report scams, unsafe content or abusive behaviour" onPress={()=>navigation.navigate('Legal',{section:'safety'})}/>
     <Row title="Community Guidelines" subtitle="What is and is not allowed on WORKIT" onPress={()=>navigation.navigate('Legal',{section:'community'})}/>
   </View>
   <Text style={s.section}>WORKIT</Text>
   <View style={s.card}>
     <Row title="Privacy Policy" onPress={()=>navigation.navigate('Legal',{section:'privacy'})}/>
     <Row title="Terms of Service" onPress={()=>navigation.navigate('Legal',{section:'terms'})}/>
     <Row title="Marketplace & payment rules" onPress={()=>navigation.navigate('Legal',{section:'marketplace'})}/>
   </View>
   <Text style={s.section}>Account</Text>
   <View style={s.card}><Row title="Log out" danger onPress={()=>supabase.auth.signOut()}/></View>
   <Text style={s.note}>WORKIT launch candidate · Policies shown here are product-ready placeholders and must be replaced with counsel-approved production text before public launch.</Text>
 </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{paddingTop:54,paddingHorizontal:18,paddingBottom:70},back:{color:C.blue2,fontSize:12,fontWeight:'800',marginBottom:20},kicker:{color:C.blue2,fontSize:9,fontWeight:'900',letterSpacing:1.3},h1:{color:C.text,fontSize:30,fontWeight:'900',letterSpacing:-1,marginTop:5},section:{color:C.faint,fontSize:9,fontWeight:'900',letterSpacing:1,textTransform:'uppercase',marginTop:26,marginBottom:8},card:{borderRadius:18,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,overflow:'hidden'},row:{minHeight:64,paddingHorizontal:16,paddingVertical:13,flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderBottomColor:C.line},rowTitle:{color:C.text,fontSize:13,fontWeight:'800'},rowSub:{color:C.muted,fontSize:10,lineHeight:15,marginTop:3},arrow:{color:C.faint,fontSize:24,marginLeft:10},note:{color:C.faint,fontSize:9,lineHeight:15,marginTop:22}});
