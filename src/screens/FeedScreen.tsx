import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { getFeed, likePost } from '../lib/api';

const { height: H } = Dimensions.get('window');

export default function FeedScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const load = async (c?: string) => {
    try {
      const res = await getFeed(c ?? undefined);
      setItems(prev => (c ? [...prev, ...res.items] : res.items));
      setCursor(res.nextCursor);
    } catch (e) { console.warn(e); }
  };

  useEffect(() => { load(); }, []);

  const onViewable = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) setActiveIdx(viewableItems[0].index);
  }).current;

  const like = async (id: string, idx: number) => {
    setItems(prev => prev.map((p, i) => i === idx ? { ...p, like_count: p.like_count + 1 } : p));
    try { await likePost(id); } catch {}
  };

  return (
    <FlatList
      data={items}
      keyExtractor={i => i.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={H}
      decelerationRate="fast"
      onViewableItemsChanged={onViewable}
      viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
      onEndReached={() => cursor && load(cursor)}
      onEndReachedThreshold={2}
      renderItem={({ item, index }) => (
        <View style={{ height: H, backgroundColor: '#000' }}>
          {item.cf_playback_url ? (
            <Video
              source={{ uri: item.cf_playback_url }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay={index === activeIdx}
              isLooping
              isMuted={false}
            />
          ) : item.thumbnail_url ? (
            <Image source={{ uri: item.thumbnail_url }} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#111' }]} />
          )}

          <View style={s.overlay}>
            <View style={s.badge}><Text style={s.badgeTxt}>{item.type.toUpperCase()}</Text></View>
            <View style={s.info}>
              <Text style={s.name}>{item.author?.full_name}</Text>
              <Text style={s.role}>{item.author?.title}</Text>
              <Text style={s.title}>{item.title}</Text>
              {!!item.description && <Text style={s.desc} numberOfLines={2}>{item.description}</Text>}
            </View>
            <View style={s.side}>
              <TouchableOpacity style={s.action} onPress={() => like(item.id, index)}>
                <Text style={s.actionIcon}>♥</Text>
                <Text style={s.actionN}>{item.like_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.action}>
                <Text style={s.actionIcon}>💬</Text>
                <Text style={s.actionN}>{item.comment_count}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  badge: { position: 'absolute', top: 56, left: 18, backgroundColor: 'rgba(79,128,255,.25)',
           borderRadius: 100, paddingHorizontal: 11, paddingVertical: 4,
           borderWidth: 1, borderColor: 'rgba(79,128,255,.4)' },
  badgeTxt: { color: '#4F80FF', fontSize: 10, fontWeight: '700', letterSpacing: .5 },
  info: { padding: 18, paddingBottom: 90, paddingRight: 80 },
  name: { color: '#fff', fontSize: 16, fontWeight: '700' },
  role: { color: 'rgba(255,255,255,.55)', fontSize: 12, marginBottom: 8 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  desc: { color: 'rgba(255,255,255,.8)', fontSize: 13, lineHeight: 20 },
  side: { position: 'absolute', right: 14, bottom: 120, alignItems: 'center', gap: 20 },
  action: { alignItems: 'center' },
  actionIcon: { fontSize: 26, color: '#fff' },
  actionN: { color: '#fff', fontSize: 11, fontWeight: '600', marginTop: 3 },
});
