import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function RegisterScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const register = async () => {
    setBusy(true); setErr('');
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, account_type: 'individual' } },
    });
    if (error) setErr(error.message);
    setBusy(false);
  };

  return (
    <View style={s.wrap}>
      <Text style={s.logo}>WORK<Text style={{ color: '#4F80FF' }}>IT</Text></Text>
      <Text style={s.h1}>Create account</Text>
      {!!err && <Text style={s.err}>{err}</Text>}
      <TextInput style={s.input} placeholder="Full name" placeholderTextColor="#555"
        value={fullName} onChangeText={setFullName} />
      <TextInput style={s.input} placeholder="Email" placeholderTextColor="#555"
        autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Password (min 8)" placeholderTextColor="#555"
        secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={s.btn} onPress={register} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.btnTxt}>Sign Up</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={s.link}>Already have an account? <Text style={{ color: '#4F80FF' }}>Log in</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 28 },
  logo: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 28 },
  h1: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 20 },
  err: { color: '#FF6060', marginBottom: 12 },
  input: { backgroundColor: '#111', borderWidth: 1.5, borderColor: '#1E1E1E', borderRadius: 13,
           padding: 15, color: '#fff', fontSize: 16, marginBottom: 14 },
  btn: { backgroundColor: '#4F80FF', height: 52, borderRadius: 13,
         justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: '#888', textAlign: 'center', marginTop: 22 },
});
