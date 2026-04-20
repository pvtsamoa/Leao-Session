import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export default function SoundPad({ label, index, onTrigger }) {
  const [active, setActive] = useState(false);

  const handlePress = () => {
    onTrigger();
    setActive(true);
    setTimeout(() => setActive(false), 280);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`rounded-[24px] border p-4 min-h-[118px] justify-between ${
        active
          ? 'border-neon-green/60 bg-neon-green/20'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <View className="rounded-full border border-white/10 bg-black/30 self-start px-3 py-1">
        <Text className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">
          Pad {index + 1}
        </Text>
      </View>
      <View>
        <Text className={`font-black text-lg ${active ? 'text-neon-green' : 'text-white'}`}>
          {label}
        </Text>
        <Text className="text-white/55 text-xs uppercase tracking-widest mt-1">Tap to trigger</Text>
      </View>
    </Pressable>
  );
}
