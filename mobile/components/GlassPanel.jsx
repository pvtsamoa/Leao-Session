import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function GlassPanel({ children, style }) {
  return (
    <View style={[s.wrapper, style]}>
      <BlurView intensity={18} tint="dark" style={s.blur}>
        {children}
      </BlurView>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  blur: { padding: 20 },
});
