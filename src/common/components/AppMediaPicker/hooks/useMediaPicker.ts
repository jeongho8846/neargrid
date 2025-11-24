import { useState } from 'react';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';

export function useMediaPicker() {
  const [media, setMedia] = useState<Asset[]>([]);

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.9,
    });
    if (result.assets) setMedia(prev => [...prev, ...result.assets]);
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.9,
      selectionLimit: 6, // ✅ 여러 장 선택 가능
    });
    if (result.assets) setMedia(prev => [...prev, ...result.assets]);
  };

  const clearMedia = () => setMedia([]);

  return { media, openCamera, openGallery, clearMedia, setMedia };
}
