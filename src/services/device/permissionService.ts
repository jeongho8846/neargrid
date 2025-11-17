// 권한 요청 관련 로직
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import { Platform, Alert } from 'react-native';

// 타입 정의
export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

export interface PermissionResult {
  granted: boolean;
  status: PermissionStatus;
  shouldShowSettings: boolean;
}

export type PermissionType = 'camera' | 'gallery' | 'location' | 'notification';

// 권한별 설정
const PERMISSION_CONFIG: Record<
  PermissionType,
  { ios: Permission; android: Permission }
> = {
  camera: {
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  },
  gallery: {
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  },
  location: {
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  },
  notification: {
    ios: PERMISSIONS.IOS.NOTIFICATIONS,
    android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
  },
};

// 권한 상태 변환
const mapPermissionStatus = (status: string): PermissionStatus => {
  switch (status) {
    case RESULTS.GRANTED:
    case RESULTS.LIMITED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.BLOCKED:
      return 'blocked';
    default:
      return 'unavailable';
  }
};

// 권한 확인
export const checkPermission = async (
  type: PermissionType,
): Promise<PermissionStatus> => {
  const config = PERMISSION_CONFIG[type];
  const permission = Platform.OS === 'ios' ? config.ios : config.android;
  const status = await check(permission);
  return mapPermissionStatus(status);
};

// 설정으로 이동 안내
const showSettingsAlert = (type: PermissionType): Promise<boolean> => {
  return new Promise(resolve => {
    Alert.alert(
      '권한 설정 필요',
      '권한이 차단되었습니다. 설정으로 이동하여 권한을 허용해주세요.',
      [
        { text: '취소', style: 'cancel', onPress: () => resolve(false) },
        {
          text: '설정으로 이동',
          onPress: async () => {
            await openSettings();
            resolve(false);
          },
        },
      ],
    );
  });
};

// 권한 요청
export const requestPermission = async (
  type: PermissionType,
): Promise<PermissionResult> => {
  const config = PERMISSION_CONFIG[type];
  const permission = Platform.OS === 'ios' ? config.ios : config.android;

  const currentStatus = await check(permission);
  const mappedStatus = mapPermissionStatus(currentStatus);

  if (mappedStatus === 'granted') {
    return { granted: true, status: 'granted', shouldShowSettings: false };
  }

  if (mappedStatus === 'blocked') {
    await showSettingsAlert(type);
    return { granted: false, status: 'blocked', shouldShowSettings: true };
  }

  const result = await request(permission);
  const finalStatus = mapPermissionStatus(result);

  if (finalStatus === 'blocked') {
    await showSettingsAlert(type);
    return { granted: false, status: 'blocked', shouldShowSettings: true };
  }

  return {
    granted: finalStatus === 'granted',
    status: finalStatus,
    shouldShowSettings: false,
  };
};

// 기존 함수들 (호환성 유지)
export async function requestLocationPermission(): Promise<boolean> {
  const result = await requestPermission('location');
  return result.granted;
}

export async function requestCameraPermission(): Promise<boolean> {
  const result = await requestPermission('camera');
  return result.granted;
}

export async function requestGalleryPermission(): Promise<boolean> {
  const result = await requestPermission('gallery');
  return result.granted;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const result = await requestPermission('notification');
  return result.granted;
}
