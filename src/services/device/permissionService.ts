// 권한 요청 관련 로직
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

const isGranted = (status: string) => status === RESULTS.GRANTED;

// 📍 위치 권한
export async function requestLocationPermission() {
  const target =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const status = await check(target);
  if (isGranted(status)) return true;

  const req = await request(target);
  return isGranted(req);
}

// 📷 카메라 권한
export async function requestCameraPermission() {
  const target =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const status = await check(target);
  if (isGranted(status)) return true;

  const req = await request(target);
  return isGranted(req);
}

// 🖼️ 사진첩 권한
export async function requestGalleryPermission() {
  const target =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

  const status = await check(target);
  if (isGranted(status)) return true;

  const req = await request(target);
  return isGranted(req);
}

// 🎤 마이크 권한
export async function requestMicrophonePermission() {
  const target =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;

  const status = await check(target);
  if (isGranted(status)) return true;

  const req = await request(target);
  return isGranted(req);
}
