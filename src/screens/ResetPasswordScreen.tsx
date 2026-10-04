import React, { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { validateNewPassword } from '../lib/authRecovery';
import { C, S } from '../lib/theme';

type Props = { status: 'loading' | 'ready' | 'error'; onClose: () => void };
export default function ResetPasswordScreen({ status, onClose }: Props) {
  const operation = useRef(false); const completed = useRef(false);
  const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [saved, setSaved] = useState(false);
  const leave = async () => {
    if (operation.current || status === 'loading') return;
    if (status === 'error') { onClose(); return; }
    operation.current = true; setBusy(true); setError('');
    try { const { error: failure } = await supabase.auth.signOut({ scope: 'local' }); if (failure) throw failure; onClose(); }
    catch { setError('Could not close this session. Check your connection and try again.'); }
    finally { operation.current = false; setBusy(false); }
  };
  const save = async () => {
    if (operation.current || status !== 'ready' || completed.current) return;
    const invalid = validateNewPassword(password, confirmation); if (invalid) { setError(invalid); return; }
    operation.current = true; setBusy(true); setError('');
    try { const { error: failure } = await supabase.auth.updateUser({ password }); if (failure) throw failure; setPassword(''); setConfirmation(''); completed.current = true; setSaved(true); }
    catch { setError('Could not update your password. The link may have expired or the password may not meet account security requirements. Try again or request a new link.'); }
    finally { operation.current = false; setBusy(false); }
  };
  return <KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Text style={s.logo}>WORK<Text style={{ color: C.violet2 }}>IT</Text></Text><Text style={s.kicker}>ACCOUNT RECOVERY</Text>
    <Text style={s.title}>{status === 'loading' ? 'Checking your link…' : status === 'error' ? 'This link cannot be used.' : saved ? 'Password updated.' : 'Choose a new password.'}</Text>
    <Text style={s.body}>{status === 'error' ? 'The reset link is invalid or expired. Return to login and request a new one.' : saved ? 'Close this recovery session, then sign in with your new password.' : status === 'loading' ? 'WORKIT is securely verifying this recovery session.' : 'Use at least 8 characters. Choose a password you do not use elsewhere.'}</Text>
    {status === 'loading' && <ActivityIndicator color={C.violetSoft} style={{ marginTop: 24 }} />}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {status === 'ready' && !saved && <><Text style={s.label}>New password</Text><TextInput accessibilityLabel="New password" style={s.input} value={password} onChangeText={setPassword} placeholder="At least 8 characters" placeholderTextColor={C.faint} secureTextEntry textContentType="newPassword" autoCapitalize="none" autoCorrect={false} editable={!busy} />
      <Text style={s.label}>Confirm password</Text><TextInput accessibilityLabel="Confirm new password" style={s.input} value={confirmation} onChangeText={setConfirmation} placeholder="Repeat new password" placeholderTextColor={C.faint} secureTextEntry textContentType="newPassword" autoCapitalize="none" autoCorrect={false} editable={!busy} onSubmitEditing={() => void save()} />
      <TouchableOpacity accessibilityRole="button" disabled={busy} onPress={() => void save()} style={[s.button, busy && s.disabled]}>{busy ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Save new password</Text>}</TouchableOpacity></>}
    {status !== 'loading' && <TouchableOpacity accessibilityRole="button" disabled={busy} onPress={() => void leave()} style={saved || status === 'error' ? s.button : s.back}><Text style={saved || status === 'error' ? s.buttonText : s.backText}>{saved ? 'Back to login' : status === 'error' ? 'Back to WORKIT' : 'Cancel recovery'}</Text></TouchableOpacity>}
  </ScrollView></KeyboardAvoidingView>;
}
const s = StyleSheet.create({ page: { flex: 1, backgroundColor: C.bg }, content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 26, paddingTop: S.top, paddingBottom: 30 }, logo: { color: C.text, fontSize: 36, fontWeight: '900', letterSpacing: -1.6 }, kicker: { color: C.violetSoft, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 40 }, title: { color: C.text, fontSize: 32, fontWeight: '900', letterSpacing: -1, marginTop: 10 }, body: { color: C.muted, fontSize: 14, lineHeight: 22, marginTop: 12 }, label: { color: C.text, fontSize: 12, fontWeight: '700', marginTop: 22, marginBottom: 8 }, input: { backgroundColor: C.panel, borderColor: C.line, borderWidth: 1, borderRadius: 16, color: C.text, fontSize: 15, padding: 15 }, button: { backgroundColor: C.violet, minHeight: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20 }, buttonText: { color: '#fff', fontSize: 14, fontWeight: '800' }, disabled: { opacity: .5 }, error: { color: '#FF9DBA', fontSize: 13, lineHeight: 20, marginTop: 15 }, back: { padding: 16, alignItems: 'center' }, backText: { color: C.violetSoft, fontSize: 13, fontWeight: '700' } });
