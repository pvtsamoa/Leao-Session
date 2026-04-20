import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useSoundboard } from '../../hooks/useSoundboard';
import { soundConfig } from '../../lib/soundConfig';
import SoundPad from '../../components/SoundPad';

export default function SoundboardScreen() {
  const { triggerSound } = useSoundboard();

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-neon-yellow text-xs uppercase tracking-widest">Leao Sessions</Text>
        <Text className="text-white font-black text-2xl mt-1">Soundboard</Text>
        <Text className="text-white/55 text-sm mt-1">
          Tap pads to layer sounds over your music
        </Text>
      </View>

      <FlatList
        data={soundConfig}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item, index }) => (
          <View className="flex-1">
            <SoundPad
              label={item.label}
              index={index}
              onTrigger={() => triggerSound(item.id)}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}
