import { create } from 'zustand';

export const useMusicStore = create((set, get) => ({
  activeTrack: null,
  playerVisible: false,
  playerKey: 0,

  setTrack: (track) => set({ activeTrack: track, playerVisible: true, playerKey: get().playerKey + 1 }),
  togglePlayer: () => set((s) => ({
    playerVisible: !s.playerVisible,
    playerKey: !s.playerVisible ? s.playerKey + 1 : s.playerKey,
  })),
  clearTrack: () => set({ activeTrack: null, playerVisible: false }),
}));
