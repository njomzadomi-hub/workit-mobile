import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getUploadUrl, api } from '../lib/api';

export default function UploadScreen() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('video');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const pickAndUpload = async () => {
    setMsg('');
    const pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 180,
    });
    if (pick.canceled) return;
    setBusy(true);
    try {
      const { uploadUrl, videoUid } = await getUploadUrl();
      const file = pick.assets[0];
      const form = new FormData();
      form.append('file', { uri: file.uri, name: 'video.mp4', type: 'video/mp4' } as any);
      await fetch(uploadUrl, { method: 'POST', body: form });
      await api('/posts', {
        method: 'POST',
        body: JSON.stringify({ type, title, description: desc, cf_video_uid: videoUid }),
      });
      setMsg('✓ Posted! Video is processing.');
      setTitle(''); setDesc('');
    } catch (e: any) {
      setMsg('Upload failed: ' + e.message);
    }
    setBusy(false);
  };

  const types = ['video', 'hire_me', 'service', 'pitch', 'teach'];

  return (
    <View style={s.wrap}>
      <Text style={s.h1}>Create</Text>
      <View style={s.typeRow}>
        {types.map(t => (
          <TouchableOpacity key={t} style={[s.typePill, type === t && s.typePillOn]} onPress={() => setType(t)}>
            <Text style={[s.typeTxt, type === t && s.typeTxtOn]}>{t.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={s.input} placeholder="Title" placeholderTextColor="#555"
        value={title} onChangeText={setTitle} />
      <TextInput style={[s.input, { height: 90 }]} placeholder="Description" placeholderTextColor="#555"
        multiline value={desc} onChangeText={setDesc} />
      <TouchableOpacity style={s.btn} onPress={pickAndUpload} disabled={busy || !title}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.btnTxt}>Pick Video & Post</Text>}
      </TouchableOpacity>
      {!!msg && <Text style={s.msg}>{msg}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#000', padding: 24, paddingTop: 70 },
  h1: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 20 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typePill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, borderWidth: 1, borderColor: '#222' },
  typePillOn: { backgroundColor: '#fff', borderColor: '#fff' },
  typeTxt: { color: '#888', fontSize: 12, fontWeight: '700' },
  typeTxtOn: { color: '#000' },
  input: { backgroundColor: '#111', borderWidth: 1.5, borderColor: '#1E1E1E', borderRadius: 13,
           padding: 15, color: '#fff', fontSize: 15, marginBottom: 14 },
  btn: { backgroundColor: '#4F80FF', height: 52, borderRadius: 13,
         justifyContent: 'center', alignItems: 'center' },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  msg: { color: '#00D085', marginTop: 14, textAlign: 'center' },
});
