import { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSearch } from '../../hooks/useSearch';
import { useMusicStore } from '../../store/musicStore';
import TrackCard from '../../components/TrackCard';
import NowPlaying from '../../components/NowPlaying';

function parseSunoId(input) {
  const trimmed = input.trim();
  const match = trimmed.match(/(?:suno\.com\/(?:song|s|embed)\/)([a-zA-Z0-9-]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9-]{8,}$/.test(trimmed)) return trimmed;
  return null;
}

export default function MusicScreen() {
  const { query, setQuery, results, loading } = useSearch();
  const { activeTrack, playerVisible, playerKey, setTrack, togglePlayer } = useMusicStore();
  const [sunoInput, setSunoInput] = useState('');

  const handleSunoLoad = () => {
    const id = parseSunoId(sunoInput);
    if (!id) return;
    setTrack({ id, source: 'suno', title: 'Suno Track', artist: 'Suno AI', artwork: '', embedUrl: `https://suno.com/embed/${id}` });
    setSunoInput('');
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.label}>Leao Sessions</Text>
        <Text style={s.title}>Music</Text>
      </View>

      <View style={s.sunoRow}>
        <TextInput
          value={sunoInput}
          onChangeText={setSunoInput}
          onSubmitEditing={handleSunoLoad}
          placeholder="Paste a Suno URL or ID"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={s.sunoInput}
        />
        <Pressable onPress={handleSunoLoad} disabled={!sunoInput.trim()} style={s.sunoBtn}>
          <Text style={s.sunoBtnText}>Load</Text>
        </Pressable>
      </View>

      <View style={s.searchRow}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search any song or artist"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={s.searchInput}
        />
        {loading && <ActivityIndicator color="#6dff67" size="small" />}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.source}-${item.id}`}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        ListHeaderComponent={
          activeTrack ? (
            <NowPlaying track={activeTrack} playerVisible={playerVisible} playerKey={playerKey} onToggle={togglePlayer} />
          ) : null
        }
        renderItem={({ item }) => <TrackCard track={item} onPress={() => setTrack(item)} />}
        ListEmptyComponent={
          !loading ? (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>Start typing to search all sources</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  label: { color: '#00d4ff', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 },
  title: { color: '#fff', fontWeight: '900', fontSize: 24, marginTop: 4 },
  sunoRow: { marginHorizontal: 20, marginBottom: 12, flexDirection: 'row', gap: 8 },
  sunoInput: { flex: 1, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(109,255,103,0.3)', backgroundColor: 'rgba(109,255,103,0.05)', paddingHorizontal: 16, paddingVertical: 12, color: '#fff', fontSize: 14 },
  sunoBtn: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(109,255,103,0.4)', backgroundColor: 'rgba(109,255,103,0.1)', paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'center' },
  sunoBtnText: { color: '#6dff67', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 },
  searchRow: { marginHorizontal: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 16, paddingVertical: 12 },
  searchIcon: { fontSize: 16, color: 'rgba(255,255,255,0.4)' },
  searchInput: { flex: 1, color: '#fff', fontSize: 16, backgroundColor: 'transparent' },
  emptyBox: { borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 16, paddingVertical: 24, alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.45)', fontSize: 14 },
});
