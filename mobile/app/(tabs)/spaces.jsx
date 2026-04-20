import { useEffect } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, SafeAreaView } from 'react-native';
import { useSpaces } from '../../hooks/useSpaces';
import { useAuthStore } from '../../store/authStore';
import SpaceCard from '../../components/SpaceCard';

export default function SpacesScreen() {
  const { spaces, loading, error, refresh } = useSpaces();
  const { user, clearAuth } = useAuthStore();

  useEffect(() => { refresh(); }, []);

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-neon-blue text-xs uppercase tracking-widest">Leao Sessions</Text>
          <Text className="text-white font-black text-2xl mt-1">Live Spaces</Text>
        </View>
        <Pressable onPress={clearAuth} className="border border-white/10 rounded-[14px] px-3 py-2">
          <Text className="text-white/55 text-xs uppercase tracking-wider">
            {user?.username ? `@${user.username}` : 'Sign out'}
          </Text>
        </Pressable>
      </View>

      <View className="px-5 pb-2 flex-row items-center justify-between">
        <Text className="text-white/45 text-xs uppercase tracking-wider">
          {spaces.length > 0 ? `${spaces.length} live now` : ''}
        </Text>
        <Pressable onPress={refresh} className="border border-neon-blue/30 rounded-[12px] px-3 py-1">
          <Text className="text-neon-blue text-xs uppercase tracking-wider">Refresh</Text>
        </Pressable>
      </View>

      {error ? (
        <View className="mx-5 rounded-[18px] border border-red-400/40 bg-red-500/10 px-4 py-3">
          <Text className="text-red-200 text-sm">{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={loading ? [] : spaces}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => <SpaceCard space={item} />}
        refreshing={loading}
        onRefresh={refresh}
        ListEmptyComponent={
          loading ? (
            <View className="items-center py-12">
              <ActivityIndicator color="#00d4ff" />
              <Text className="text-white/45 text-sm mt-4">Finding live Spaces...</Text>
            </View>
          ) : (
            <View className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-8 items-center">
              <Text className="text-white/45 text-sm">No live Spaces right now</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
