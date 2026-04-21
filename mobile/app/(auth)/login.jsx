import { useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useXAuth, exchangeCodeForToken, saveTokens, fetchXUser } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { request, response, promptAsync, redirectUri } = useXAuth();
  const setAuth = useAuthStore((s) => s.setAuth);

  console.log('Redirect URI:', redirectUri);

  useEffect(() => {
    if (!response) return;
    async function handleResponse() {
      if (response.type !== 'success') return;
      try {
        const { code } = response.params;
        const tokens = await exchangeCodeForToken(code, request.codeVerifier, redirectUri);
        await saveTokens(tokens);
        const user = await fetchXUser(tokens.access_token);
        setAuth(tokens.access_token, user);
        router.replace('/(tabs)/spaces');
      } catch (err) {
        console.error('Auth error:', err);
      }
    }
    handleResponse();
  }, [response]);

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>Leao Sessions</Text>
      <Text style={s.subtitle}>Ride the vibe</Text>
      <Pressable disabled={!request} onPress={() => promptAsync({ showInRecents: false, createTask: false })} style={s.btn}>
        {!request ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.btnText}>Log in with X</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { color: '#fff', fontWeight: '900', fontSize: 36, marginBottom: 8, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, textAlign: 'center', marginBottom: 48, lineHeight: 24 },
  btn: { borderRadius: 20, backgroundColor: 'rgba(176,38,255,0.8)', borderWidth: 1, borderColor: 'rgba(176,38,255,0.4)', paddingHorizontal: 32, paddingVertical: 16, alignItems: 'center', width: '100%' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', letterSpacing: 3 },
});
