import { View } from 'react-native';
import YTPlayer from 'react-native-youtube-iframe';

export default function YoutubePlayer({ videoId, play }) {
  return (
    <View className="rounded-[22px] overflow-hidden bg-black/40">
      <YTPlayer
        height={200}
        videoId={videoId}
        play={play}
        webViewProps={{ allowsInlineMediaPlayback: true }}
      />
    </View>
  );
}
