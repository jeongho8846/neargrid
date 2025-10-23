// 카메라 촬영 관련 로직
import { launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { requestCameraPermission } from './permissionService';

export async function openCamera(): Promise<ImagePickerResponse | null> {
  const granted = await requestCameraPermission();
  if (!granted) return null;

  return new Promise(resolve => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.8,
      },
      response => resolve(response),
    );
  });
}
