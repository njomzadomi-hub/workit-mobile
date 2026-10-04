// Executes the actual parser, App and recovery screens with mocked auth/OS services.
// No live emails, passwords or auth tokens are sent. Physical-device QA is separate.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const tick = async () => { for (let i = 0; i < 8; i++) await new Promise(resolve => setImmediate(resolve)); };
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; };
function harness() {
  let cursor=0; const slots=[]; const effects=[]; const cleanups=[];
  const react={Fragment:'Fragment',createElement:(type,props,...children)=>({type,props:{...props,children}}),
    useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return[slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];},
    useRef(initial){const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];},
    useEffect(fn,deps){const i=cursor++;const old=slots[i];if(!old||deps.some((x,n)=>x!==old[n])){slots[i]=deps;effects.push(fn);}}
  };
  return {react,slots,draw(fn,props={}){cursor=0;const tree=fn(props);while(effects.length){const cleanup=effects.shift()();if(cleanup)cleanups.push(cleanup);}return tree;},close(){cleanups.forEach(fn=>fn());}};
}
function compile(file, mocks, suffix='') {
  const result=esbuild.transformSync(fs.readFileSync(file,'utf8'),{loader:file.endsWith('.tsx')?'tsx':'ts',format:'cjs',jsx:'transform'});
  const mod={exports:{}};new Function('require','module','exports',result.code+'\n'+suffix)(id=>{
    if(id in mocks)return mocks[id];
    if(id.includes('/screens/'))return{__esModule:true,default:id.split('/').pop()};
    throw new Error(`Unmocked import ${id}`);
  },mod,mod.exports);return mod.exports;
}
const recovery=compile('src/lib/authRecovery.ts',{});
const good='workit://reset-password#type=recovery&access_token=synthetic-access&refresh_token=synthetic-refresh';
for(const url of ['https://example.test/reset-password#type=recovery','workit://other','garbage'])assert.equal(recovery.parseRecoveryLink(url).kind,'ignore');
for(const url of ['workit://reset-password#type=signup&access_token=x&refresh_token=y','workit://reset-password#type=recovery&access_token=x','workit://reset-password?access_token=x#type=recovery&access_token=y&refresh_token=z','workit://reset-password/extra#type=recovery&access_token=x&refresh_token=y','workit://reset-password#error=access_denied','workit://reset-password#type=recovery&access_token=%20&refresh_token=y'])assert.equal(recovery.parseRecoveryLink(url).kind,'invalid');
assert.equal(recovery.parseRecoveryLink(good).kind,'session');assert.equal(recovery.parseRecoveryLink(good.replace('#','?')).kind,'session');
assert.ok(recovery.validateNewPassword('short','short'));assert.ok(recovery.validateNewPassword('SyntheticPass1','other'));assert.equal(recovery.validateNewPassword('SyntheticPass1','SyntheticPass1'),'');
const native={ActivityIndicator:'ActivityIndicator',Text:'Text',TextInput:'TextInput',TouchableOpacity:'TouchableOpacity',View:'View',KeyboardAvoidingView:'KeyboardAvoidingView',ScrollView:'ScrollView',Platform:{OS:'android'},StyleSheet:{create:x=>x}};
const theme={C:{bg:'#000',text:'#fff',violet:'#85f'},F:{body:'sans-serif'},S:{top:52},glow:{}};
function walk(tree,predicate){if(!tree||typeof tree!=='object')return null;if(predicate(tree))return tree;for(const child of(tree.props?.children||[]).flat(Infinity)){const found=walk(child,predicate);if(found)return found;}return null;}
function screen(file,auth){const h=harness();const mod=compile(file,{'react':h.react,'react-native':native,'../lib/supabase':{supabase:{auth}},'../lib/theme':theme,'../lib/authRecovery':recovery});return{h,draw:props=>h.draw(mod.default,props)};}
function app(auth,initialURL=null){const h=harness();let onAuth,onLink,onNotification;const navigations=[];let removed=0;
 const api={...auth,onAuthStateChange:fn=>{onAuth=fn;return{data:{subscription:{unsubscribe:()=>removed++}}};}};
 const refs={isReady:()=>true,getRootState:()=>({routeNames:['MainTabs']}),navigate:(...args)=>navigations.push(args)};
 const nav={Navigator:'Navigator',Screen:'Screen'};
 const mod=compile('App.tsx',{'react':h.react,'react-native':{...native,Linking:{getInitialURL:async()=>initialURL,addEventListener:(_,fn)=>{onLink=fn;return{remove:()=>removed++};}}},'@react-navigation/native':{NavigationContainer:'NavigationContainer',DarkTheme:{colors:{}},createNavigationContainerRef:()=>refs},'@react-navigation/bottom-tabs':{createBottomTabNavigator:()=>nav},'@react-navigation/native-stack':{createNativeStackNavigator:()=>nav},'expo-status-bar':{StatusBar:'StatusBar'},'expo-notifications':{addNotificationResponseReceivedListener:fn=>{onNotification=fn;return{remove:()=>removed++};},getLastNotificationResponseAsync:async()=>null},'./src/lib/supabase':{supabase:{auth:api}},'./src/lib/api':{getMe:async()=>({onboarding_completed:true})},'./src/lib/push':{registerForPushNotifications:async()=>null},'./src/lib/theme':theme,'./src/lib/authRecovery':recovery});
 return{h,draw:()=>h.draw(mod.default),emitAuth:(...a)=>onAuth(...a),link:url=>onLink({url}),push:data=>onNotification({notification:{request:{content:{data}}}}),navigations,get removed(){return removed;}};
}
(async()=>{
 // Session failure is retryable; no blank screen and no navigation to protected routes.
 let calls=0;const failed=app({getSession:async()=>{if(!calls++)throw Error('offline');return{data:{session:null},error:null};}});failed.draw();await tick();let tree=failed.draw();assert.ok(walk(tree,x=>x.type==='Text'&&x.props.children.includes('Couldn’t restore your session')));const retry=walk(tree,x=>x.type==='TouchableOpacity');retry.props.onPress();await tick();tree=failed.draw();assert.equal(tree.type,'NavigationContainer');failed.h.close();assert.equal(failed.removed,3);
 // A recovery sign-in cannot be overwritten by an older session restore response.
 const initial=deferred();const token=deferred();let current;const restored={user:{id:'synthetic-user'}};
 current=app({getSession:()=>initial.promise,setSession:async()=>{await token.promise;current.emitAuth('SIGNED_IN',restored);return{data:{session:restored},error:null};}});current.draw();current.link(good);tree=current.draw();assert.equal(walk(tree,x=>x.type==='ResetPasswordScreen').props.status,'loading');current.push({type:'message',conversation_id:'synthetic-chat'});assert.equal(current.navigations.length,0);token.resolve();await tick();initial.resolve({data:{session:null},error:null});await tick();tree=current.draw();assert.equal(walk(tree,x=>x.type==='ResetPasswordScreen').props.status,'ready');assert.equal(current.h.slots[0],restored);current.h.close();
 const coldSession={user:{id:'synthetic-cold'}};let cold;cold=app({getSession:async()=>({data:{session:null},error:null}),setSession:async()=>{cold.emitAuth('SIGNED_IN',coldSession);return{data:{session:coldSession},error:null};}},good);cold.draw();await tick();assert.equal(walk(cold.draw(),x=>x.type==='ResetPasswordScreen').props.status,'ready');assert.equal(cold.h.slots[0],coldSession);cold.h.close();
 let verification=0;const expired=app({getSession:async()=>({data:{session:null},error:null}),setSession:async()=>{verification++;throw Error('expired');}});expired.draw();expired.link('workit://reset-password#type=signup&access_token=x&refresh_token=y');assert.equal(verification,0);expired.link(good);await tick();assert.equal(walk(expired.draw(),x=>x.type==='ResetPasswordScreen').props.status,'error');expired.h.close();
 // Password mismatch never reaches the service. Double taps cannot issue duplicate updates.
 const update=deferred();let updates=0,signouts=0,closes=0;const reset=screen('src/screens/ResetPasswordScreen.tsx',{updateUser:async payload=>{updates++;assert.equal(payload.password,'SyntheticPass1');await update.promise;return{error:null};},signOut:async options=>{assert.equal(options.scope,'local');signouts++;return{error:null};}});const props={status:'ready',onClose:()=>closes++};tree=reset.draw(props);walk(tree,x=>x.props.accessibilityLabel==='New password').props.onChangeText('SyntheticPass1');walk(tree,x=>x.props.accessibilityLabel==='Confirm new password').props.onChangeText('mismatch');tree=reset.draw(props);walk(tree,x=>x.type==='TouchableOpacity').props.onPress();await tick();assert.equal(updates,0);walk(tree,x=>x.props.accessibilityLabel==='Confirm new password').props.onChangeText('SyntheticPass1');tree=reset.draw(props);const save=walk(tree,x=>x.type==='TouchableOpacity');save.props.onPress();save.props.onPress();await tick();assert.equal(updates,1);update.resolve();await tick();tree=reset.draw(props);assert.equal(walk(tree,x=>x.type==='TextInput'),null);walk(tree,x=>x.type==='TouchableOpacity').props.onPress();await tick();assert.equal(signouts,1);assert.equal(closes,1);reset.h.close();
 // Reset requests are isolated, use the correct redirect and enforce a resend cooldown.
 let emails=0;const mail=deferred();const forgot=screen('src/screens/ForgotPasswordScreen.tsx',{resetPasswordForEmail:async(email,options)=>{emails++;assert.equal(email,'sample@example.test');assert.equal(options.redirectTo,recovery.PASSWORD_RESET_REDIRECT);await mail.promise;return{error:null};}});const fp={navigation:{goBack(){}}};tree=forgot.draw(fp);walk(tree,x=>x.type==='TouchableOpacity').props.onPress();await tick();assert.equal(emails,0);walk(tree,x=>x.type==='TextInput').props.onChangeText(' SAMPLE@EXAMPLE.TEST ');tree=forgot.draw(fp);const send=walk(tree,x=>x.type==='TouchableOpacity');send.props.onPress();send.props.onPress();await tick();assert.equal(emails,1);mail.resolve();await tick();tree=forgot.draw(fp);const again=walk(tree,x=>x.type==='TouchableOpacity');assert.equal(again.props.disabled,true);again.props.onPress();await tick();assert.equal(emails,1);forgot.h.close();
 console.log('Actual auth source: callback allowlist/ambiguity, expired link, password validation, restore retry/race, push isolation, duplicate update/request guards and recovery sign-out passed (mocked services).');
})().catch(error=>{console.error(error);process.exitCode=1;});
