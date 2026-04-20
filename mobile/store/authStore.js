import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { fetchXUser, refreshAccessToken, clearTokens } from '../lib/auth';

export const useAuthStore = create((set) => ({
  xToken: null,
  user: null,
  hydrated: false,

  setAuth: (token, user) => set({ xToken: token, user }),

  clearAuth: async () => {
    await clearTokens();
    set({ xToken: null, user: null });
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('xToken');
      if (!token) {
        set({ hydrated: true });
        return;
      }
      const user = await fetchXUser(token);
      set({ xToken: token, user, hydrated: true });
    } catch {
      try {
        const refreshToken = await SecureStore.getItemAsync('xRefreshToken');
        if (refreshToken) {
          const { access_token, refresh_token } = await refreshAccessToken(refreshToken);
          await SecureStore.setItemAsync('xToken', access_token);
          if (refresh_token) await SecureStore.setItemAsync('xRefreshToken', refresh_token);
          const user = await fetchXUser(access_token);
          set({ xToken: access_token, user, hydrated: true });
          return;
        }
      } catch {
        await clearTokens();
      }
      set({ hydrated: true });
    }
  },
}));
