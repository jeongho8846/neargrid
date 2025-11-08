import { useState } from 'react';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import { Platform, Alert } from 'react-native';

export function useMediaPicker() {
  const [media, setMedia] = useState<Asset[]>([]);

  const requestPermission = async (type: 'camera' | 'gallery') => {
    let permission;

    if (Platform.OS === 'android') {
      permission =
        type === 'camera'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES ??
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    } else {
      permission =
        type === 'camera'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
    }

    const result = await check(permission);
    if (result === RESULTS.GRANTED) return true;

    const newStatus = await request(permission);
    if (newStatus === RESULTS.GRANTED) return true;

    if (newStatus === RESULTS.BLOCKED) {
      Alert.alert(
        '권한 필요',
        '설정에서 카메라 또는 사진 접근 권한을 허용해주세요.',
        [{ text: '설정 열기', onPress: openSettings }, { text: '취소' }],
      );
    }

    return false;
  };

  const openGallery = async () => {
    const granted = await requestPermission('gallery');
    if (!granted) return;

    const res = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 5,
    });
    if (!res.didCancel && res.assets) setMedia([...media, ...res.assets]);
  };

  const openCamera = async () => {
    const granted = await requestPermission('camera');
    if (!granted) return;

    const res = await launchCamera({ mediaType: 'photo' });
    if (!res.didCancel && res.assets) setMedia([...media, ...res.assets]);
  };

  const clearMedia = () => setMedia([]);

  return { media, openGallery, openCamera, clearMedia };
}
