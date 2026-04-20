import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.VERCEL_URL ?? 'http://localhost:3000';

export async function apiFetch(path, options = {}) {
  const token = await SecureStore.getItemAsync('xToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}
