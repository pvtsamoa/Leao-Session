import { View } from 'react-native';
import { BlurView } from 'expo-blur';

export default function GlassPanel({ children, className = '' }) {
  return (
    <View className={`rounded-[30px] overflow-hidden border border-white/10 ${className}`}>
      <BlurView intensity={18} tint="dark" className="p-5">
        {children}
      </BlurView>
    </View>
  );
}
