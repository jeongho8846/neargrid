// 사진첩 접근 관련 로직
import {
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { requestGalleryPermission } from './permissionService';

export async function openGallery(): Promise<ImagePickerResponse | null> {
  const granted = await requestGalleryPermission();
  if (!granted) return null;

  return new Promise(resolve => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      response => resolve(response),
    );
  });
}
