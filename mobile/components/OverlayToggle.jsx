import { Pressable, Text, StyleSheet, View } from 'react-native';
import { useOverlay } from '../hooks/useOverlay';

export default function OverlayToggle() {
  const { visible, permitted, enable, disable } = useOverlay();

  return (
    <View style={s.row}>
      <Pressable onPress={visible ? disable : enable} style={[s.btn, visible && s.btnActive]}>
        <Text style={s.icon}>🫧</Text>
        <Text style={[s.label, visible && s.labelActive]}>
          {visible ? 'Hide Overlay' : permitted ? 'Float Over X' : 'Enable Overlay'}
        </Text>
      </Pressable>
      {!permitted && (
        <Text style={s.hint}>Tap to grant "Draw over apps" permission</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: { marginHorizontal: 20, marginBottom: 12 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 18, borderWidth: 1,
    borderColor: 'rgba(176,38,255,0.3)',
    backgroundColor: 'rgba(176,38,255,0.08)',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  btnActive: {
    borderColor: 'rgba(176,38,255,0.7)',
    backgroundColor: 'rgba(176,38,255,0.2)',
  },
  icon: { fontSize: 20 },
  label: { color: 'rgba(255,255,255,0.6)', fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5 },
  labelActive: { color: '#b026ff' },
  hint: { color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 6, marginLeft: 4 },
});
