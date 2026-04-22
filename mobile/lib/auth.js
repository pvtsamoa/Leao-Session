import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const CLIENT_ID = Constants.expoConfig?.extra?.TWITTER_CLIENT_ID ?? '';

const discovery = {
  authorizationEndpoint: 'https://x.com/i/oauth2/authorize',
  tokenEndpoint: 'https://api.twitter.com/2/oauth2/token',
  revocationEndpoint: 'https://api.twitter.com/2/oauth2/revoke',
};

export function useXAuth() {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'leaosessions', path: 'auth' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri,
      scopes: ['tweet.read', 'users.read', 'offline.access'],
      usePKCE: true,
    },
    discovery,
  );

  return { request, response, promptAsync, redirectUri };
}

export async function exchangeCodeForToken(code, codeVerifier, redirectUri) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const res = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) throw new Error('Token exchange failed');
  return res.json();
}

export async function refreshAccessToken(refreshToken) {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });

  const res = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) throw new Error('Token refresh failed');
  return res.json();
}

export async function fetchXUser(accessToken) {
  const res = await fetch('https://api.twitter.com/2/users/me?user.fields=name,username,profile_image_url', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  const payload = await res.json();
  return payload.data;
}

export async function saveTokens({ access_token, refresh_token }) {
  await SecureStore.setItemAsync('xToken', access_token);
  if (refresh_token) await SecureStore.setItemAsync('xRefreshToken', refresh_token);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync('xToken');
  await SecureStore.deleteItemAsync('xRefreshToken');
}
