import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from './permissionService';

export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  const granted = await requestLocationPermission();
  if (!granted) return null;

  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      pos => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      error => {
        console.warn('Location error:', error);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}
