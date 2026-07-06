import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { getMe } from '../lib/api';

export default function ProfileScreen() {
  const [p, setP] = useState<any>(null);

  useEffect(() => { getMe().then(setP).catch(console.warn); }, []);

  if (!p) return <View style={s.wrap} />;

  return (
    <ScrollView style={s.wrap} contentContainerStyle={{ padding: 24, paddingTop: 70 }}>
      <View style={s.avatarWrap}>
        {p.avatar_url
          ? <Image source={{ uri: p.avatar_url }} style={s.avatar} />
          : <View style={[s.avatar, s.avatarPh]}><Text style={s.avatarTxt}>{p.full_name?.[0]}</Text></View>}
      </View>
      <Text style={s.name}>{p.full_name}</Text>
      {!!p.title && <Text style={s.title}>{p.title}</Text>}
      {!!p.bio && <Text style={s.bio}>{p.bio}</Text>}
      <View style={s.stats}>
        <Stat n={p.video_count} l="Videos" />
        <Stat n={p.follower_count} l="Followers" />
        <Stat n={p.following_count} l="Following" />
      </View>
      <TouchableOpacity style={s.logout} onPress={() => supabase.auth.signOut()}>
        <Text style={s.logoutTxt}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const Stat = ({ n, l }: any) => (
  <View style={s.stat}>
    <Text style={s.statN}>{n ?? 0}</Text>
    <Text style={s.statL}>{l}</Text>
  </View>
);

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#000' },
  avatarWrap: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPh: { backgroundColor: '#4F80FF', justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: '#fff', fontSize: 34, fontWeight: '700' },
  name: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  title: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 4 },
  bio: { color: '#aaa', fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 21 },
  stats: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginVertical: 26 },
  stat: { alignItems: 'center' },
  statN: { color: '#fff', fontSize: 20, fontWeight: '700' },
  statL: { color: '#666', fontSize: 11, marginTop: 3, textTransform: 'uppercase' },
  logout: { borderWidth: 1, borderColor: '#333', borderRadius: 13, height: 48,
            justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  logoutTxt: { color: '#FF6060', fontWeight: '600' },
});
