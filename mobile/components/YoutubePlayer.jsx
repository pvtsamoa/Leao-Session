import { View, StyleSheet } from 'react-native';
import YTPlayer from 'react-native-youtube-iframe';

export default function YoutubePlayer({ videoId, play }) {
  return (
    <View style={s.wrapper}>
      <YTPlayer
        height={200}
        videoId={videoId}
        play={play}
        webViewProps={{ allowsInlineMediaPlayback: true }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { borderRadius: 22, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)' },
});
