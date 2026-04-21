import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

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
      style={[s.pad, active ? s.padActive : s.padIdle]}
    >
      <View style={s.padLabel}>
        <Text style={s.padLabelText}>Pad {index + 1}</Text>
      </View>
      <View>
        <Text style={[s.padName, active && s.padNameActive]}>{label}</Text>
        <Text style={s.tapHint}>Tap to trigger</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  pad: { borderRadius: 24, borderWidth: 1, padding: 16, minHeight: 118, justifyContent: 'space-between' },
  padIdle: { borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' },
  padActive: { borderColor: 'rgba(109,255,103,0.6)', backgroundColor: 'rgba(109,255,103,0.2)' },
  padLabel: { borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.3)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4 },
  padLabelText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 2 },
  padName: { color: '#fff', fontWeight: '900', fontSize: 18 },
  padNameActive: { color: '#6dff67' },
  tapHint: { color: 'rgba(255,255,255,0.55)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
});
