import { View, Text, Pressable, Linking } from 'react-native';

export default function SpaceCard({ space }) {
  return (
    <View className="rounded-[22px] border border-white/10 bg-white/5 p-4 mb-3">
      <View className="flex-row items-center gap-2 mb-2">
        <View className="rounded-full bg-neon-yellow/20 border border-neon-yellow/30 px-3 py-1">
          <Text className="text-neon-yellow text-xs font-bold uppercase tracking-widest">
            {space.hostName}
          </Text>
        </View>
        <View className="rounded-full bg-red-500/20 border border-red-400/30 px-2 py-1">
          <Text className="text-red-300 text-xs font-bold uppercase tracking-widest">Live</Text>
        </View>
      </View>

      <Text className="text-white font-black text-base leading-snug mb-2" numberOfLines={2}>
        {space.title}
      </Text>

      <View className="flex-row items-center justify-between mt-1">
        <Text className="text-white/55 text-xs">
          {space.listenerCount > 0
            ? `${new Intl.NumberFormat('en-US').format(space.listenerCount)} listening`
            : 'Live now'}
        </Text>
        <Pressable
          onPress={() => Linking.openURL(space.url)}
          className="rounded-[14px] bg-neon-green/20 border border-neon-green/40 px-4 py-2"
        >
          <Text className="text-neon-green text-xs font-black uppercase tracking-wider">
            Join Space
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
