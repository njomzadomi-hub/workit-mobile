import React,{useEffect,useState}from'react';
import{Alert,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View}from'react-native';
import{createOrganization,updateOrganization}from'../lib/api';
import{C,F,S}from'../lib/theme';

export default function CompanySetupScreen({route,navigation}:any){
 const existing=route.params?.organization||null;
 const[name,setName]=useState(existing?.name||'');const[industry,setIndustry]=useState(existing?.industry||'');const[location,setLocation]=useState(existing?.location||'');const[website,setWebsite]=useState(existing?.website||'');const[bio,setBio]=useState(existing?.bio||'');const[busy,setBusy]=useState(false);
 useEffect(()=>{navigation.setOptions?.({gestureEnabled:!busy})},[busy]);
 const save=async()=>{if(!name.trim())return Alert.alert('Company name required');setBusy(true);try{const payload={name:name.trim(),industry:industry.trim()||null,location:location.trim()||null,website:website.trim()||null,bio:bio.trim()||null};const org=existing?await updateOrganization(existing.id,payload):await createOrganization(payload);navigation.replace('Company',{slug:org.slug})}catch(e:any){Alert.alert('Could not save company',e?.message||'Please try again.')}finally{setBusy(false)}};
 return<ScrollView style={s.page} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
  <View style={s.top}><TouchableOpacity onPress={()=>navigation.goBack()}><Text style={s.back}>‹</Text></TouchableOpacity><Text style={s.wordmark}>WORK<Text style={{color:C.violet2}}>IT</Text></Text><View style={{width:28}}/></View>
  <Text style={s.kicker}>EMPLOYER IDENTITY</Text><Text style={s.h1}>{existing?'Edit company':'Create your company'}</Text><Text style={s.sub}>People should understand who is hiring them before they apply.</Text>
  <Input label="Company name" value={name} onChange={setName} placeholder="Studio, restaurant, clinic, factory..."/>
  <Input label="Industry" value={industry} onChange={setIndustry} placeholder="Construction, Hospitality, Healthcare..."/>
  <Input label="Location" value={location} onChange={setLocation} placeholder="Valletta, Malta"/>
  <Input label="Website" value={website} onChange={setWebsite} placeholder="company.com"/>
  <Input label="About" value={bio} onChange={setBio} placeholder="What do you do, what kind of team are you building, what matters at work?" area/>
  <TouchableOpacity disabled={busy} onPress={save} style={[s.save,{opacity:busy?.55:1}]}><Text style={s.saveTxt}>{busy?'Saving…':existing?'Save company':'Create company'}</Text><Text style={s.saveTxt}>→</Text></TouchableOpacity>
 </ScrollView>
}
const Input=({label,value,onChange,placeholder,area}:any)=><View style={s.field}><Text style={s.label}>{label}</Text><TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={C.faint} multiline={!!area} style={[s.input,area&&s.area]}/></View>;
const s=StyleSheet.create({page:{flex:1,backgroundColor:C.bg},content:{paddingTop:S.top,paddingHorizontal:S.pageX,paddingBottom:90},top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{color:C.text,fontSize:34},wordmark:{color:C.text,fontFamily:F.body,fontSize:25,fontWeight:'900'},kicker:{color:C.violetSoft,fontSize:9,fontWeight:'900',letterSpacing:1.3,marginTop:24},h1:{color:C.text,fontSize:31,fontWeight:'900',letterSpacing:-1,marginTop:6},sub:{color:C.muted,fontSize:12,lineHeight:18,marginTop:8},field:{marginTop:17},label:{color:C.text,fontSize:9,fontWeight:'900',marginBottom:6},input:{borderWidth:1,borderColor:C.line,borderRadius:15,backgroundColor:C.panel,paddingHorizontal:13,paddingVertical:13,color:C.text,fontSize:12},area:{minHeight:110,textAlignVertical:'top'},save:{height:56,borderRadius:16,backgroundColor:C.violet,marginTop:22,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},saveTxt:{color:'#fff',fontSize:12,fontWeight:'900'}});