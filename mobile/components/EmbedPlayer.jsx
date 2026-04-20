import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function EmbedPlayer({ uri }) {
  return (
    <View className="rounded-[22px] overflow-hidden bg-black/40" style={{ height: 200 }}>
      <WebView
        source={{ uri }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        style={{ flex: 1, backgroundColor: '#000' }}
      />
    </View>
  );
}
