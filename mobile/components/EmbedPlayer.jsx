import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function EmbedPlayer({ uri }) {
  return (
    <View style={s.wrapper}>
      <WebView
        source={{ uri }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        style={s.webview}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { borderRadius: 22, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', height: 200 },
  webview: { flex: 1, backgroundColor: '#000' },
});
