import { useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { soundConfig } from '../lib/soundConfig';
import { onOverlayAction } from '../modules/overlay/src/index';

export function useSoundboard() {
  const playerMap = useRef({});

  useEffect(() => {
    let mounted = true;

    async function loadSounds() {
      try {
        await setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
      } catch {
        // audio mode not available — sounds still play with defaults
      }

      for (const pad of soundConfig) {
        try {
          const player = createAudioPlayer(pad.file);
          if (mounted) playerMap.current[pad.id] = player;
        } catch {
          // sound file failed to load — pad will be silently skipped
        }
      }
    }

    loadSounds();

    const sub = onOverlayAction((action) => {
      if (action.startsWith('pad:')) triggerSound(action.slice(4));
    });

    return () => {
      mounted = false;
      sub?.remove();
      Object.values(playerMap.current).forEach((p) => p.remove());
    };
  }, []);

  const triggerSound = async (id) => {
    const player = playerMap.current[id];
    if (!player) return;
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // playback error — ignore silently
    }
  };

  return { triggerSound };
}
