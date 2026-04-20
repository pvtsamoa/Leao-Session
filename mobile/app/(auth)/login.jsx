import { useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useXAuth, exchangeCodeForToken, saveTokens, fetchXUser } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { request, response, promptAsync, redirectUri } = useXAuth();
  const setAuth = useAuthStore((s) => s.setAuth);

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
    <SafeAreaView className="flex-1 bg-canvas items-center justify-center px-6">
      <Text className="text-white font-black text-4xl mb-2 text-center">Leao Sessions</Text>
      <Text className="text-white/60 text-base text-center mb-12 leading-relaxed">
        Ride the vibe
      </Text>

      <Pressable
        disabled={!request}
        onPress={() => promptAsync()}
        className="rounded-[20px] bg-neon-purple/80 border border-neon-purple/40 px-8 py-4 items-center w-full"
      >
        {!request ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-black text-base uppercase tracking-widest">
            Log in with X
          </Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}
