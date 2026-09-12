import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './src/lib/supabase';
import { C } from './src/lib/theme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import FeedScreen from './src/screens/FeedScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import UploadScreen from './src/screens/UploadScreen';
import MarketScreen from './src/screens/MarketScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PricingScreen from './src/screens/PricingScreen';
import EarningsScreen from './src/screens/EarningsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const icons: Record<string,string> = { Feed:'◉', Explore:'⌕', Post:'＋', Market:'◇', Profile:'●' };

function ProfileStackScreen() {
  return <ProfileStack.Navigator screenOptions={{headerShown:false}}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen}/>
    <ProfileStack.Screen name="Pricing" component={PricingScreen}/>
    <ProfileStack.Screen name="Earnings" component={EarningsScreen}/>
  </ProfileStack.Navigator>;
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={({route})=>({
      headerShown:false,
      tabBarStyle:{backgroundColor:'rgba(8,8,9,.98)',borderTopColor:C.line,height:74,paddingTop:8,paddingBottom:10},
      tabBarActiveTintColor:C.text, tabBarInactiveTintColor:C.faint,
      tabBarLabelStyle:{fontSize:9,fontWeight:'800',letterSpacing:.5,textTransform:'uppercase'},
      tabBarIcon:({color})=> route.name==='Post'
        ? <View style={s.postIcon}><Text style={s.postPlus}>＋</Text></View>
        : <Text style={{color,fontSize:21,fontWeight:'700'}}>{icons[route.name]}</Text>
    })}>
      <Tab.Screen name="Feed" component={FeedScreen}/>
      <Tab.Screen name="Explore" component={ExploreScreen}/>
      <Tab.Screen name="Post" component={UploadScreen}/>
      <Tab.Screen name="Market" component={MarketScreen}/>
      <Tab.Screen name="Profile" component={ProfileStackScreen}/>
    </Tab.Navigator>
  );
}

export default function App() {
  const [session,setSession]=useState<any>(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)});
    const {data:sub}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return()=>sub.subscription.unsubscribe();
  },[]);
  if(loading) return <View style={{flex:1,backgroundColor:C.bg}}/>;
  return <NavigationContainer theme={{...DarkTheme,colors:{...DarkTheme.colors,background:C.bg,card:C.bg,border:C.line,text:C.text,primary:C.blue}}}>
    <StatusBar style="light"/>
    {session?<Tabs/>:<Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="Login" component={LoginScreen}/><Stack.Screen name="Register" component={RegisterScreen}/></Stack.Navigator>}
  </NavigationContainer>
}

const s=StyleSheet.create({postIcon:{width:48,height:36,borderRadius:13,backgroundColor:C.text,alignItems:'center',justifyContent:'center',marginTop:-6},postPlus:{color:'#000',fontSize:25,fontWeight:'500',marginTop:-2}});
