import React, { useEffect, useState } from 'react';
import { AppState, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { C } from '../lib/theme';

type Props = { uri: string; style?: StyleProp<ViewStyle>; playing?: boolean; muted?: boolean; loop?: boolean; controls?: boolean };
export default function WorkVideo({ uri, style, playing = false, muted = false, loop = false, controls = false }: Props) {
  const focused = useIsFocused();
  const [foreground, setForeground] = useState(AppState.currentState !== 'background' && AppState.currentState !== 'inactive');
  const player = useVideoPlayer(uri, p => { p.loop = loop; p.muted = muted; });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => setForeground(state === 'active'));
    return () => sub.remove();
  }, []);
  useEffect(() => { player.muted = muted; player.loop = loop; }, [player, muted, loop]);
  useEffect(() => {
    if (focused && foreground && playing) player.play();
    else player.pause();
  }, [player, playing, focused, foreground]);
  if (status === 'error') return <View style={[style, s.fallback]} accessibilityRole="text"><Text style={s.message}>Video unavailable</Text><Text style={s.hint}>Check your connection or reopen this profile.</Text></View>;
  return <VideoView player={player} style={style} contentFit="cover" nativeControls={controls && focused && foreground} surfaceType="textureView" />;
}
const s = StyleSheet.create({ fallback: { backgroundColor: C.panel, alignItems: 'center', justifyContent: 'center', padding: 16 }, message: { color: C.text, fontSize: 14, fontWeight: '700' }, hint: { color: C.muted, fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: 6 } });
