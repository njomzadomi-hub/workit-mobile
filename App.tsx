import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './src/lib/supabase';
import { C, F, glow } from './src/lib/theme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import FeedScreen from './src/screens/FeedScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import UploadScreen from './src/screens/UploadScreen';
import MarketScreen from './src/screens/MarketScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PricingScreen from './src/screens/PricingScreen';
import EarningsScreen from './src/screens/EarningsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LegalScreen from './src/screens/LegalScreen';
import HiringScreen from './src/screens/HiringScreen';
import InboxScreen from './src/screens/InboxScreen';
import ChatScreen from './src/screens/ChatScreen';
import MarketDetailScreen from './src/screens/MarketDetailScreen';
import JobDetailScreen from './src/screens/JobDetailScreen';
import ProfessionalScreen from './src/screens/ProfessionalScreen';
import GlobalSearchScreen from './src/screens/GlobalSearchScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import CommentsScreen from './src/screens/CommentsScreen';

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const icons: Record<string,string> = { Feed:'⌂', Explore:'◉', Post:'＋', Market:'▢', Profile:'♙' };

function ProfileStackScreen() {
  return <ProfileStack.Navigator screenOptions={{headerShown:false}}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen}/>
    <ProfileStack.Screen name="Pricing" component={PricingScreen}/>
    <ProfileStack.Screen name="Earnings" component={EarningsScreen}/>
    <ProfileStack.Screen name="Hiring" component={HiringScreen}/>
    <ProfileStack.Screen name="Settings" component={SettingsScreen}/>
    <ProfileStack.Screen name="Legal" component={LegalScreen}/>
  </ProfileStack.Navigator>;
}

function TabIcon({route,color,focused}:any){
  if(route.name==='Post') return <View style={[s.postIcon,focused&&s.postIconOn]}><Text style={s.postPlus}>＋</Text></View>;
  return <View style={[s.navIcon,focused&&s.navIconOn]}><Text style={[s.navGlyph,{color}]}>{icons[route.name]}</Text></View>;
}

function Tabs() {
  return <Tab.Navigator screenOptions={({route})=>({
    headerShown:false,
    tabBarStyle:{backgroundColor:'rgba(5,9,15,.98)',borderTopColor:C.lineSoft,height:80,paddingTop:8,paddingBottom:11},
    tabBarActiveTintColor:C.violetSoft,
    tabBarInactiveTintColor:'#8A93A7',
    tabBarLabelStyle:{fontSize:10,fontWeight:'800',letterSpacing:.1,textTransform:'none',fontFamily:F.body},
    tabBarIcon:({color,focused})=><TabIcon route={route} color={color} focused={focused}/>,
    tabBarHideOnKeyboard:true,
  })}>
    <Tab.Screen name="Feed" component={FeedScreen}/>
    <Tab.Screen name="Explore" component={ExploreScreen}/>
    <Tab.Screen name="Post" component={UploadScreen}/>
    <Tab.Screen name="Market" component={MarketScreen}/>
    <Tab.Screen name="Profile" component={ProfileStackScreen}/>
  </Tab.Navigator>;
}

function LoggedInApp(){
 return <AppStack.Navigator screenOptions={{headerShown:false,contentStyle:{backgroundColor:C.bg}}}>
   <AppStack.Screen name="MainTabs" component={Tabs}/>
   <AppStack.Screen name="GlobalSearch" component={GlobalSearchScreen}/>
   <AppStack.Screen name="Notifications" component={NotificationsScreen}/>
   <AppStack.Screen name="Comments" component={CommentsScreen}/>
   <AppStack.Screen name="Inbox" component={InboxScreen}/>
   <AppStack.Screen name="Chat" component={ChatScreen}/>
   <AppStack.Screen name="MarketDetail" component={MarketDetailScreen}/>
   <AppStack.Screen name="JobDetail" component={JobDetailScreen}/>
   <AppStack.Screen name="Professional" component={ProfessionalScreen}/>
 </AppStack.Navigator>;
}

export default function App() {
  const [session,setSession]=useState<any>(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)});
    const {data:sub}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return()=>sub.subscription.unsubscribe();
  },[]);
  if(loading) return <View style={{flex:1,backgroundColor:C.bg}}/>;
  return <NavigationContainer theme={{...DarkTheme,colors:{...DarkTheme.colors,background:C.bg,card:C.bg,border:C.line,text:C.text,primary:C.violet}}}>
    <StatusBar style="light"/>
    {session?<LoggedInApp/>:<AuthStack.Navigator screenOptions={{headerShown:false}}><AuthStack.Screen name="Login" component={LoginScreen}/><AuthStack.Screen name="Register" component={RegisterScreen}/></AuthStack.Navigator>}
  </NavigationContainer>;
}

const s=StyleSheet.create({
  navIcon:{width:37,height:31,borderRadius:12,alignItems:'center',justifyContent:'center'},
  navIconOn:{backgroundColor:'rgba(139,92,246,.10)',...glow},
  navGlyph:{fontSize:23,fontWeight:'700'},
  postIcon:{width:49,height:42,borderRadius:14,backgroundColor:'#F2F5FF',alignItems:'center',justifyContent:'center',marginTop:-8,borderWidth:1,borderColor:'#DCE4FF'},
  postIconOn:{...glow,borderColor:C.violetSoft},
  postPlus:{color:C.black,fontSize:27,fontWeight:'400',marginTop:-2}
});
