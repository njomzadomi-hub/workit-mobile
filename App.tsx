import React,{useEffect,useState}from'react';
import{ActivityIndicator,Text,TouchableOpacity,View,StyleSheet}from'react-native';
import{NavigationContainer,DarkTheme,createNavigationContainerRef}from'@react-navigation/native';
import{createBottomTabNavigator}from'@react-navigation/bottom-tabs';
import{createNativeStackNavigator}from'@react-navigation/native-stack';
import{StatusBar}from'expo-status-bar';
import*as Notifications from'expo-notifications';
import{supabase}from'./src/lib/supabase';
import{getMe}from'./src/lib/api';
import{registerForPushNotifications}from'./src/lib/push';
import{C,F,glow}from'./src/lib/theme';
import LoginScreen from'./src/screens/LoginScreen';
import RegisterScreen from'./src/screens/RegisterScreen';
import FeedScreen from'./src/screens/FeedScreen';
import ExploreScreen from'./src/screens/ExploreScreen';
import UploadScreen from'./src/screens/UploadScreen';
import MarketScreen from'./src/screens/MarketScreen';
import SelfProfileScreen from'./src/screens/SelfProfileScreen';
import PricingScreen from'./src/screens/PricingScreen';
import EarningsScreen from'./src/screens/EarningsScreen';
import SettingsScreen from'./src/screens/SettingsScreen';
import LegalScreen from'./src/screens/LegalScreen';
import HiringScreen from'./src/screens/HiringScreen';
import CompanyScreen from'./src/screens/CompanyScreen';
import CompanySetupScreen from'./src/screens/CompanySetupScreen';
import InboxScreen from'./src/screens/InboxScreen';
import ChatScreen from'./src/screens/ChatScreen';
import MarketDetailScreen from'./src/screens/MarketDetailScreen';
import JobDetailScreen from'./src/screens/JobDetailScreen';
import ProfessionalScreen from'./src/screens/ProfessionalScreen';
import GlobalSearchScreen from'./src/screens/GlobalSearchScreen';
import NotificationsScreen from'./src/screens/NotificationsScreen';
import CommentsScreen from'./src/screens/CommentsScreen';
import EditProfileScreen from'./src/screens/EditProfileScreen';
import MyApplicationsScreen from'./src/screens/MyApplicationsScreen';
import MyOrdersScreen from'./src/screens/MyOrdersScreen';
import SavedItemsScreen from'./src/screens/SavedItemsScreen';
import OnboardingScreen from'./src/screens/OnboardingScreen';
import PreferencesScreen from'./src/screens/PreferencesScreen';
import AccountScreen from'./src/screens/AccountScreen';
import CandidateInviteScreen from'./src/screens/CandidateInviteScreen';

const Tab=createBottomTabNavigator();const AuthStack=createNativeStackNavigator();const AppStack=createNativeStackNavigator();const ProfileStack=createNativeStackNavigator();
const navRef=createNavigationContainerRef<any>();
const icons:Record<string,string>={Feed:'⌂',Explore:'◉',Post:'＋',Market:'▢',Profile:'♙'};

function ProfileStackScreen(){return<ProfileStack.Navigator screenOptions={{headerShown:false}}><ProfileStack.Screen name="ProfileHome" component={SelfProfileScreen}/><ProfileStack.Screen name="EditProfile" component={EditProfileScreen}/><ProfileStack.Screen name="Pricing" component={PricingScreen}/><ProfileStack.Screen name="Earnings" component={EarningsScreen}/><ProfileStack.Screen name="Hiring" component={HiringScreen}/><ProfileStack.Screen name="Company" component={CompanyScreen}/><ProfileStack.Screen name="CompanySetup" component={CompanySetupScreen}/><ProfileStack.Screen name="Settings" component={SettingsScreen}/><ProfileStack.Screen name="Preferences" component={PreferencesScreen}/><ProfileStack.Screen name="Account" component={AccountScreen}/><ProfileStack.Screen name="Legal" component={LegalScreen}/></ProfileStack.Navigator>}
function TabIcon({route,color,focused}:any){if(route.name==='Post')return<View style={[s.postIcon,focused&&s.postIconOn]}><Text style={s.postPlus}>＋</Text></View>;return<View style={[s.navIcon,focused&&s.navIconOn]}><Text style={[s.navGlyph,{color}]}>{icons[route.name]}</Text></View>}
function Tabs(){return<Tab.Navigator screenOptions={({route})=>({headerShown:false,tabBarStyle:{backgroundColor:'rgba(5,9,15,.98)',borderTopColor:C.lineSoft,height:80,paddingTop:8,paddingBottom:11},tabBarActiveTintColor:C.violetSoft,tabBarInactiveTintColor:'#8A93A7',tabBarLabelStyle:{fontSize:10,fontWeight:'800',letterSpacing:.1,textTransform:'none',fontFamily:F.body},tabBarIcon:({color,focused})=><TabIcon route={route} color={color} focused={focused}/>,tabBarHideOnKeyboard:true})}><Tab.Screen name="Feed" component={FeedScreen}/><Tab.Screen name="Explore" component={ExploreScreen}/><Tab.Screen name="Post" component={UploadScreen}/><Tab.Screen name="Market" component={MarketScreen}/><Tab.Screen name="Profile" component={ProfileStackScreen}/></Tab.Navigator>}
function LoggedInApp(){useEffect(()=>{void registerForPushNotifications()},[]);return<AppStack.Navigator screenOptions={{headerShown:false,contentStyle:{backgroundColor:C.bg}}}><AppStack.Screen name="MainTabs" component={Tabs}/><AppStack.Screen name="GlobalSearch" component={GlobalSearchScreen}/><AppStack.Screen name="Notifications" component={NotificationsScreen}/><AppStack.Screen name="Comments" component={CommentsScreen}/><AppStack.Screen name="Inbox" component={InboxScreen}/><AppStack.Screen name="Chat" component={ChatScreen}/><AppStack.Screen name="MarketDetail" component={MarketDetailScreen}/><AppStack.Screen name="JobDetail" component={JobDetailScreen}/><AppStack.Screen name="CompanyPublic" component={CompanyScreen}/><AppStack.Screen name="Professional" component={ProfessionalScreen}/><AppStack.Screen name="CandidateInvite" component={CandidateInviteScreen}/><AppStack.Screen name="MyApplications" component={MyApplicationsScreen}/><AppStack.Screen name="MyOrders" component={MyOrdersScreen}/><AppStack.Screen name="Saved" component={SavedItemsScreen}/></AppStack.Navigator>}
function SessionGate(){const[checking,setChecking]=useState(true);const[done,setDone]=useState(false);const[error,setError]=useState('');const check=async()=>{setChecking(true);setError('');try{const p=await getMe();setDone(!!p.onboarding_completed)}catch{setError('WORKIT could not load your professional profile. Check your connection and try again.')}finally{setChecking(false)}};useEffect(()=>{void check()},[]);if(checking)return<View style={s.gate}><ActivityIndicator color={C.violetSoft}/><Text style={s.gateMuted}>Loading your WORKIT profile…</Text></View>;if(error)return<View style={s.gate}><Text style={s.gateWordmark}>WORK<Text style={{color:C.violet2}}>IT</Text></Text><Text style={s.gateTitle}>Couldn’t load your profile</Text><Text style={s.gateMuted}>{error}</Text><TouchableOpacity style={s.retry} onPress={()=>void check()}><Text style={s.retryTxt}>Try again</Text></TouchableOpacity></View>;return done?<LoggedInApp/>:<OnboardingScreen onDone={()=>setDone(true)}/>}

function routePush(data:any){if(!navRef.isReady())return;const type=String(data?.type||'').toLowerCase();const postId=data?.post_id||data?.job_post_id;const conversationId=data?.conversation_id;if((type.includes('message')||type.includes('chat'))&&conversationId){navRef.navigate('Chat',{conversationId});return}if(type.includes('message')||type.includes('chat')){navRef.navigate('Inbox');return}if((type==='application'||type.includes('interview')||type.includes('offer')||type.includes('hired'))&&postId){navRef.navigate('JobDetail',{jobId:postId});return}if(data?.market_item_id){navRef.navigate('MarketDetail',{id:data.market_item_id});return}navRef.navigate('Notifications')}

export default function App(){const[session,setSession]=useState<any>(null);const[loading,setLoading]=useState(true);useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)});const{data:sub}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));const notificationSub=Notifications.addNotificationResponseReceivedListener(response=>routePush(response.notification.request.content.data||{}));return()=>{sub.subscription.unsubscribe();notificationSub.remove()}},[]);if(loading)return<View style={{flex:1,backgroundColor:C.bg}}/>;return<NavigationContainer ref={navRef} theme={{...DarkTheme,colors:{...DarkTheme.colors,background:C.bg,card:C.bg,border:C.line,text:C.text,primary:C.violet}}}><StatusBar style="light"/>{session?<SessionGate/>:<AuthStack.Navigator screenOptions={{headerShown:false}}><AuthStack.Screen name="Login" component={LoginScreen}/><AuthStack.Screen name="Register" component={RegisterScreen}/></AuthStack.Navigator>}</NavigationContainer>}

const s=StyleSheet.create({navIcon:{width:37,height:31,borderRadius:12,alignItems:'center',justifyContent:'center'},navIconOn:{backgroundColor:'rgba(139,92,246,.10)',...glow},navGlyph:{fontSize:23,fontWeight:'700'},postIcon:{width:49,height:42,borderRadius:14,backgroundColor:'#F2F5FF',alignItems:'center',justifyContent:'center',marginTop:-8,borderWidth:1,borderColor:'#DCE4FF'},postIconOn:{...glow,borderColor:C.violetSoft},postPlus:{color:C.black,fontSize:27,fontWeight:'400',marginTop:-2},gate:{flex:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center',paddingHorizontal:34},gateWordmark:{color:C.text,fontFamily:F.body,fontSize:34,fontWeight:'900',letterSpacing:-1.4,marginBottom:24},gateTitle:{color:C.text,fontSize:22,fontWeight:'900',textAlign:'center'},gateMuted:{color:C.muted,fontSize:13,lineHeight:20,textAlign:'center',marginTop:10},retry:{marginTop:22,minWidth:150,height:50,borderRadius:15,backgroundColor:C.violet,alignItems:'center',justifyContent:'center'},retryTxt:{color:'#fff',fontSize:12,fontWeight:'900'}});