import { View, Text, Image, Pressable } from 'react-native';
import YoutubePlayer from './YoutubePlayer';
import EmbedPlayer from './EmbedPlayer';

const sourceColors = {
  youtube: 'border-red-400/30 bg-red-500/10 text-red-200',
  audius: 'border-neon-purple/40 bg-neon-purple/10 text-white',
  soundcloud: 'border-orange-400/30 bg-orange-500/10 text-orange-200',
  suno: 'border-neon-green/40 bg-neon-green/10 text-neon-green',
};

export default function NowPlaying({ track, playerVisible, playerKey, onToggle }) {
  if (!track) return null;
  const badgeStyle = sourceColors[track.source] ?? sourceColors.audius;

  return (
    <View className="rounded-[22px] border border-white/10 bg-white/5 p-3 mb-4">
      <View className="flex-row gap-3 mb-3">
        <Image
          source={{ uri: track.artwork || 'https://placehold.co/144x144/0a0a0a/FFFFFF?text=Leao' }}
          className="w-20 h-20 rounded-[18px]"
          resizeMode="cover"
        />
        <View className="flex-1 min-w-0">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1">
              <Text className="text-white/55 text-xs uppercase tracking-widest mb-1">Now loaded</Text>
              <Text className="text-white font-black text-base" numberOfLines={2}>{track.title}</Text>
              <Text className="text-white/65 text-sm mt-1" numberOfLines={1}>{track.artist}</Text>
            </View>
            <View className={`rounded-full border px-2 py-1 ${badgeStyle}`}>
              <Text className={`text-[10px] font-bold uppercase tracking-wider ${badgeStyle.split(' ').pop()}`}>
                {track.source}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onToggle}
            className="mt-3 rounded-[16px] bg-neon-blue/80 px-4 py-3 items-center"
          >
            <Text className="text-black font-black text-xs uppercase tracking-widest">
              {playerVisible ? 'Pause' : 'Play'}
            </Text>
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
