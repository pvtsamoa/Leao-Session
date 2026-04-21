import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

const sourceBadge = {
  youtube: { border: 'rgba(248,113,113,0.3)', bg: 'rgba(239,68,68,0.1)', text: '#fecaca' },
  audius:  { border: 'rgba(176,38,255,0.4)',  bg: 'rgba(176,38,255,0.1)', text: '#fff' },
  soundcloud: { border: 'rgba(251,146,60,0.3)', bg: 'rgba(249,115,22,0.1)', text: '#fdba74' },
  suno:    { border: 'rgba(109,255,103,0.4)',  bg: 'rgba(109,255,103,0.1)', text: '#6dff67' },
};

export default function TrackCard({ track, onPress }) {
  const badge = sourceBadge[track.source] ?? sourceBadge.audius;

  return (
    <Pressable onPress={onPress} style={s.card}>
      <Image
        source={{ uri: track.artwork || 'https://placehold.co/120x120/0a0a0a/FFFFFF?text=Track' }}
        style={s.artwork}
        resizeMode="cover"
      />
      <View style={s.info}>
        <View style={s.topRow}>
          <View style={s.textGroup}>
            <Text style={s.trackTitle} numberOfLines={1}>{track.title}</Text>
            <Text style={s.artist} numberOfLines={1}>{track.artist}</Text>
          </View>
          <View style={[s.badge, { borderColor: badge.border, backgroundColor: badge.bg }]}>
            <Text style={[s.badgeText, { color: badge.text }]}>{track.source}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, marginBottom: 12 },
  artwork: { width: 64, height: 64, borderRadius: 16 },
  info: { flex: 1, minWidth: 0 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  textGroup: { flex: 1, minWidth: 0 },
  trackTitle: { color: '#fff', fontWeight: '900', fontSize: 14 },
  artist: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 4 },
  badge: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
});
