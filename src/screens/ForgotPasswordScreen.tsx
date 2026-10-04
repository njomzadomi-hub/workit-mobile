import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { PASSWORD_RESET_REDIRECT } from '../lib/authRecovery';
import { C, S } from '../lib/theme';

export default function ForgotPasswordScreen({ navigation }: any) {
  const sending = useRef(false); const sentAt = useRef(0);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(v => Math.max(0, v - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  const send = async () => {
    if (sending.current || cooldown || Date.now() - sentAt.current < 60000) return;
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) { setError('Enter a valid email address.'); return; }
    sending.current = true; setBusy(true); setError('');
    try {
      const { error: failure } = await supabase.auth.resetPasswordForEmail(clean, { redirectTo: PASSWORD_RESET_REDIRECT });
      if (failure) throw failure;
      sentAt.current = Date.now(); setSent(true); setCooldown(60);
    } catch { setError('Could not send a reset link. Check your connection and try again later.'); }
    finally { sending.current = false; setBusy(false); }
  };
  return <KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Text style={s.logo}>WORK<Text style={{ color: C.violet2 }}>IT</Text></Text>
    <Text style={s.kicker}>ACCOUNT RECOVERY</Text><Text style={s.title}>{sent ? 'Check your email.' : 'Back to your work.'}</Text>
    <Text style={s.body}>{sent ? 'If an account uses this email, you will receive a reset link. Open it on the phone where WORKIT is installed. Check spam too.' : 'Enter your account email. We will send you a link to choose a new password.'}</Text>
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    <Text style={s.label}>Email</Text><TextInput accessibilityLabel="Account email" style={s.input} value={email} onChangeText={v => { setEmail(v); setSent(false); }} placeholder="you@example.com" placeholderTextColor={C.faint} keyboardType="email-address" textContentType="emailAddress" autoCapitalize="none" autoCorrect={false} editable={!busy} onSubmitEditing={() => void send()} />
    <TouchableOpacity accessibilityRole="button" disabled={busy || cooldown > 0} onPress={() => void send()} style={[s.button, (busy || cooldown > 0) && s.disabled]}>{busy ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>{cooldown ? `Send again in ${cooldown}s` : sent ? 'Send another link' : 'Send reset link'}</Text>}</TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" onPress={() => navigation.goBack()} style={s.back}><Text style={s.backText}>Back to login</Text></TouchableOpacity>
  </ScrollView></KeyboardAvoidingView>;
}
const s = StyleSheet.create({ page: { flex: 1, backgroundColor: C.bg }, content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 26, paddingTop: S.top, paddingBottom: 30 }, logo: { color: C.text, fontSize: 36, fontWeight: '900', letterSpacing: -1.6 }, kicker: { color: C.violetSoft, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 40 }, title: { color: C.text, fontSize: 34, fontWeight: '900', letterSpacing: -1, marginTop: 10 }, body: { color: C.muted, fontSize: 14, lineHeight: 22, marginTop: 12 }, label: { color: C.text, fontSize: 12, fontWeight: '700', marginTop: 25, marginBottom: 8 }, input: { backgroundColor: C.panel, borderColor: C.line, borderWidth: 1, borderRadius: 16, color: C.text, fontSize: 15, padding: 15 }, button: { backgroundColor: C.violet, minHeight: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20 }, buttonText: { color: '#fff', fontSize: 14, fontWeight: '800' }, disabled: { opacity: .5 }, error: { color: '#FF9DBA', fontSize: 13, lineHeight: 20, marginTop: 15 }, back: { padding: 16, alignItems: 'center' }, backText: { color: C.violetSoft, fontSize: 13, fontWeight: '700' } });
