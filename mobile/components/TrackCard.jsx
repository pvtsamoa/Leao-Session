import { View, Text, Image, Pressable } from 'react-native';

const sourceColors = {
  youtube: 'border-red-400/30 bg-red-500/10 text-red-200',
  audius: 'border-neon-purple/40 bg-neon-purple/10 text-white',
  soundcloud: 'border-orange-400/30 bg-orange-500/10 text-orange-200',
  suno: 'border-neon-green/40 bg-neon-green/10 text-neon-green',
};

export default function TrackCard({ track, onPress }) {
  const badgeStyle = sourceColors[track.source] ?? sourceColors.audius;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 p-3 mb-3"
    >
      <Image
        source={{ uri: track.artwork || 'https://placehold.co/120x120/0a0a0a/FFFFFF?text=Track' }}
        className="w-16 h-16 rounded-[16px]"
        resizeMode="cover"
      />
      <View className="flex-1 min-w-0">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1 min-w-0">
            <Text className="text-white font-black text-sm" numberOfLines={1}>{track.title}</Text>
            <Text className="text-white/60 text-sm mt-1" numberOfLines={1}>{track.artist}</Text>
          </View>
          <View className={`rounded-full border px-2 py-1 ${badgeStyle}`}>
            <Text className={`text-[10px] font-bold uppercase tracking-wider ${badgeStyle.split(' ').pop()}`}>
              {track.source}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
