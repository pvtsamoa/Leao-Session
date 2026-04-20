import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { soundConfig } from '../lib/soundConfig';

export function useSoundboard() {
  const soundMap = useRef({});

  useEffect(() => {
    let mounted = true;

    async function loadSounds() {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

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

    return () => {
      mounted = false;
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
