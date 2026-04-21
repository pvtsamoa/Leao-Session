import { create } from 'zustand';

export const useOverlayStore = create((set) => ({
  visible: false,
  permitted: false,
  setVisible: (visible) => set({ visible }),
  setPermitted: (permitted) => set({ permitted }),
}));
