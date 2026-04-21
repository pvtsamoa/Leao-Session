import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';

export default function SpaceCard({ space }) {
  return (
    <View style={s.card}>
      <View style={s.badgeRow}>
        <View style={s.hostBadge}>
          <Text style={s.hostText}>{space.hostName}</Text>
        </View>
        <View style={s.liveBadge}>
          <Text style={s.liveText}>Live</Text>
        </View>
      </View>

      <Text style={s.spaceTitle} numberOfLines={2}>{space.title}</Text>

      <View style={s.footer}>
        <Text style={s.listeners}>
          {space.listenerCount > 0
            ? `${new Intl.NumberFormat('en-US').format(space.listenerCount)} listening`
            : 'Live now'}
        </Text>
        <Pressable onPress={() => Linking.openURL(space.url)} style={s.joinBtn}>
          <Text style={s.joinText}>Join Space</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, marginBottom: 12 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  hostBadge: { borderRadius: 999, backgroundColor: 'rgba(255,228,92,0.2)', borderWidth: 1, borderColor: 'rgba(255,228,92,0.3)', paddingHorizontal: 12, paddingVertical: 4 },
  hostText: { color: '#ffe45c', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 },
  liveBadge: { borderRadius: 999, backgroundColor: 'rgba(239,68,68,0.2)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)', paddingHorizontal: 8, paddingVertical: 4 },
  liveText: { color: '#fca5a5', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 },
  spaceTitle: { color: '#fff', fontWeight: '900', fontSize: 16, lineHeight: 22, marginBottom: 8 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  listeners: { color: 'rgba(255,255,255,0.55)', fontSize: 12 },
  joinBtn: { borderRadius: 14, backgroundColor: 'rgba(109,255,103,0.2)', borderWidth: 1, borderColor: 'rgba(109,255,103,0.4)', paddingHorizontal: 16, paddingVertical: 8 },
  joinText: { color: '#6dff67', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
});
