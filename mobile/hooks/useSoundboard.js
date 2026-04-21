import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { soundConfig } from '../lib/soundConfig';
import { onOverlayAction } from '../modules/overlay/src/index';

export function useSoundboard() {
  const soundMap = useRef({});

  useEffect(() => {
    let mounted = true;

    async function loadSounds() {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
      } catch {
        // audio mode not available in dev — sounds still play with defaults
      }

      for (const pad of soundConfig) {
        try {
          const { sound } = await Audio.Sound.createAsync(pad.file, { shouldPlay: false });
          if (mounted) soundMap.current[pad.id] = sound;
        } catch {
          // sound file failed to load — pad will be silently skipped
        }
      }
    }

    loadSounds();

    // handle pad triggers from the native overlay
    const sub = onOverlayAction((action) => {
      if (action.startsWith('pad:')) triggerSound(action.slice(4));
    });

    return () => {
      mounted = false;
      sub?.remove();
      Object.values(soundMap.current).forEach((s) => s.unloadAsync());
    };
  }, []);

  const triggerSound = async (id) => {
    const sound = soundMap.current[id];
    if (!sound) return;
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch {
      // playback error — ignore silently
    }
  };

  return { triggerSound };
}
