import { useEffect, useCallback } from 'react';
import {
  requestOverlayPermission,
  hasOverlayPermission,
  showOverlay,
  hideOverlay,
  updateOverlayTrack,
  setOverlayPlaying,
  onOverlayAction,
} from '../modules/overlay/src/index';
import { useOverlayStore } from '../store/overlayStore';
import { useMusicStore } from '../store/musicStore';

export function useOverlay() {
  const { visible, permitted, setVisible, setPermitted } = useOverlayStore();
  const { activeTrack, playerVisible, togglePlayer } = useMusicStore();

  // check permission on mount
  useEffect(() => {
    hasOverlayPermission().then(setPermitted);
  }, []);

  // keep native overlay in sync with JS track state
  useEffect(() => {
    if (!visible || !activeTrack) return;
    updateOverlayTrack(activeTrack.title ?? '', activeTrack.artist ?? '');
    setOverlayPlaying(playerVisible);
  }, [activeTrack, playerVisible, visible]);

  // listen for actions from the native overlay (play/pause/pad taps)
  useEffect(() => {
    const sub = onOverlayAction((action) => {
      if (action === 'play' || action === 'pause') {
        togglePlayer();
      }
      // pad: prefix handled by soundboard hook separately
    });
    return () => sub?.remove();
  }, [togglePlayer]);

  const enable = useCallback(async () => {
    const ok = await hasOverlayPermission();
    if (!ok) {
      requestOverlayPermission();
      setPermitted(false);
      return;
    }
    setPermitted(true);
    showOverlay();
    setVisible(true);
  }, []);

  const disable = useCallback(() => {
    hideOverlay();
    setVisible(false);
  }, []);

  return { visible, permitted, enable, disable };
}
