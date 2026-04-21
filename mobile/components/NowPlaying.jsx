import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import YoutubePlayer from './YoutubePlayer';
import EmbedPlayer from './EmbedPlayer';

const sourceBadge = {
  youtube: { border: 'rgba(248,113,113,0.3)', bg: 'rgba(239,68,68,0.1)', text: '#fecaca' },
  audius:  { border: 'rgba(176,38,255,0.4)',  bg: 'rgba(176,38,255,0.1)', text: '#fff' },
  soundcloud: { border: 'rgba(251,146,60,0.3)', bg: 'rgba(249,115,22,0.1)', text: '#fdba74' },
  suno:    { border: 'rgba(109,255,103,0.4)',  bg: 'rgba(109,255,103,0.1)', text: '#6dff67' },
};

export default function NowPlaying({ track, playerVisible, playerKey, onToggle }) {
  if (!track) return null;
  const badge = sourceBadge[track.source] ?? sourceBadge.audius;

  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <Image
          source={{ uri: track.artwork || 'https://placehold.co/144x144/0a0a0a/FFFFFF?text=Leao' }}
          style={s.artwork}
          resizeMode="cover"
        />
        <View style={s.meta}>
          <View style={s.metaTop}>
            <View style={s.textGroup}>
              <Text style={s.nowLoadedLabel}>Now loaded</Text>
              <Text style={s.trackTitle} numberOfLines={2}>{track.title}</Text>
              <Text style={s.artist} numberOfLines={1}>{track.artist}</Text>
            </View>
            <View style={[s.badge, { borderColor: badge.border, backgroundColor: badge.bg }]}>
              <Text style={[s.badgeText, { color: badge.text }]}>{track.source}</Text>
            </View>
          </View>
          <Pressable onPress={onToggle} style={s.playBtn}>
            <Text style={s.playText}>{playerVisible ? 'Pause' : 'Play'}</Text>
          </Pressable>
        </View>
      </View>

      {playerVisible && (
        track.source === 'youtube'
          ? <YoutubePlayer key={playerKey} videoId={track.id} play />
          : <EmbedPlayer key={playerKey} uri={track.embedUrl} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, marginBottom: 16 },
  topRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  artwork: { width: 80, height: 80, borderRadius: 18 },
  meta: { flex: 1, minWidth: 0 },
  metaTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  textGroup: { flex: 1 },
  nowLoadedLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
  trackTitle: { color: '#fff', fontWeight: '900', fontSize: 16 },
  artist: { color: 'rgba(255,255,255,0.65)', fontSize: 14, marginTop: 4 },
  badge: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  playBtn: { marginTop: 12, borderRadius: 16, backgroundColor: 'rgba(0,212,255,0.8)', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  playText: { color: '#000', fontWeight: '900', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 },
});
