import { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, SafeAreaView } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-neon-blue text-xs uppercase tracking-widest">Leao Sessions</Text>
        <Text className="text-white font-black text-2xl mt-1">Music</Text>
      </View>

      <View className="mx-5 mb-3 flex-row gap-2">
        <TextInput
          value={sunoInput}
          onChangeText={setSunoInput}
          onSubmitEditing={handleSunoLoad}
          placeholder="Paste a Suno URL or ID"
          placeholderTextColor="rgba(255,255,255,0.35)"
          className="flex-1 rounded-[16px] border border-neon-green/30 bg-neon-green/5 px-4 py-3 text-white text-sm"
        />
        <Pressable
          onPress={handleSunoLoad}
          disabled={!sunoInput.trim()}
          className="rounded-[16px] border border-neon-green/40 bg-neon-green/10 px-4 py-3 justify-center"
        >
          <Text className="text-neon-green text-xs font-black uppercase tracking-wider">Load</Text>
        </Pressable>
      </View>

      <View className="mx-5 mb-3 flex-row items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
        <Text className="text-white/40 text-base">🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search any song or artist"
          placeholderTextColor="rgba(255,255,255,0.35)"
          className="flex-1 text-white text-base bg-transparent"
        />
        {loading && <ActivityIndicator color="#6dff67" size="small" />}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.source}-${item.id}`}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        ListHeaderComponent={
          activeTrack ? (
            <NowPlaying
              track={activeTrack}
              playerVisible={playerVisible}
              playerKey={playerKey}
              onToggle={togglePlayer}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <TrackCard track={item} onPress={() => setTrack(item)} />
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-6 items-center">
              <Text className="text-white/45 text-sm">Start typing to search all sources</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
