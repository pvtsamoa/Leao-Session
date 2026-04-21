import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { ExpoOverlay } = NativeModules;

const emitter = ExpoOverlay ? new NativeEventEmitter(ExpoOverlay) : null;

export function requestOverlayPermission(): void {
  if (Platform.OS === 'android') ExpoOverlay?.requestPermission();
}

export function hasOverlayPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return Promise.resolve(false);
  return ExpoOverlay?.hasPermission() ?? Promise.resolve(false);
}

export function showOverlay(): void {
  if (Platform.OS === 'android') ExpoOverlay?.showOverlay();
}

export function hideOverlay(): void {
  if (Platform.OS === 'android') ExpoOverlay?.hideOverlay();
}

export function updateOverlayTrack(title: string, artist: string): void {
  if (Platform.OS === 'android') ExpoOverlay?.updateTrack(title, artist);
}

export function setOverlayPlaying(playing: boolean): void {
  if (Platform.OS === 'android') ExpoOverlay?.setPlaying(playing);
}

export function onOverlayAction(callback: (action: string) => void) {
  return emitter?.addListener('onOverlayAction', (e) => callback(e.action));
}
