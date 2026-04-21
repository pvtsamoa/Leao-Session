import { useEffect } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpaces } from '../../hooks/useSpaces';
import { useAuthStore } from '../../store/authStore';
import SpaceCard from '../../components/SpaceCard';

export default function SpacesScreen() {
  const { spaces, loading, error, refresh } = useSpaces();
  const { user, clearAuth } = useAuthStore();

  useEffect(() => { refresh(); }, []);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.label}>Leao Sessions</Text>
          <Text style={s.title}>Live Spaces</Text>
        </View>
        <Pressable onPress={clearAuth} style={s.signOutBtn}>
          <Text style={s.signOutText}>{user?.username ? `@${user.username}` : 'Sign out'}</Text>
        </Pressable>
      </View>

      <View style={s.subHeader}>
        <Text style={s.countText}>{spaces.length > 0 ? `${spaces.length} live now` : ''}</Text>
        <Pressable onPress={refresh} style={s.refreshBtn}>
          <Text style={s.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {error ? (
        <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>
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
            <View style={s.emptyLoading}>
              <ActivityIndicator color="#00d4ff" />
              <Text style={s.emptyText}>Finding live Spaces...</Text>
            </View>
          ) : (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>No live Spaces right now</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: '#00d4ff', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 },
  title: { color: '#fff', fontWeight: '900', fontSize: 24, marginTop: 4 },
  signOutBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  signOutText: { color: 'rgba(255,255,255,0.55)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5 },
  subHeader: { paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countText: { color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5 },
  refreshBtn: { borderWidth: 1, borderColor: 'rgba(0,212,255,0.3)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  refreshText: { color: '#00d4ff', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5 },
  errorBox: { marginHorizontal: 20, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(248,113,113,0.4)', backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 16, paddingVertical: 12 },
  errorText: { color: '#fecaca', fontSize: 14 },
  emptyLoading: { alignItems: 'center', paddingVertical: 48 },
  emptyBox: { borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 16, paddingVertical: 32, alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 16 },
});
