import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSoundboard } from '../../hooks/useSoundboard';
import { soundConfig } from '../../lib/soundConfig';
import SoundPad from '../../components/SoundPad';

export default function SoundboardScreen() {
  const { triggerSound } = useSoundboard();

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.label}>Leao Sessions</Text>
        <Text style={s.title}>Soundboard</Text>
        <Text style={s.subtitle}>Tap pads to layer sounds over your music</Text>
      </View>

      <FlatList
        data={soundConfig}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item, index }) => (
          <View style={s.padWrapper}>
            <SoundPad label={item.label} index={index} onTrigger={() => triggerSound(item.id)} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  label: { color: '#ffe45c', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 },
  title: { color: '#fff', fontWeight: '900', fontSize: 24, marginTop: 4 },
  subtitle: { color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 4 },
  padWrapper: { flex: 1 },
});
