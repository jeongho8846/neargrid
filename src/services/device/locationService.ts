import Geolocation from 'react-native-geolocation-service';
import { useLocationStore } from '@/features/location/state/locationStore';

let watchId: number | null = null;

/** 앱 시작 시 3초마다 위치 추적 시작 */
export const startWatchingLocation = () => {
  const { setLocation } = useLocationStore.getState();

  if (watchId) return; // 중복 방지

  watchId = Geolocation.watchPosition(
    position => {
      const { latitude, longitude } = position.coords;
      setLocation(latitude, longitude);
      console.log(`[GPS] 위치 갱신됨 → lat: ${latitude}, lon: ${longitude}`);
    },
    error => {
      console.warn('[GPS] 감시 에러:', error);
    },
    {
      enableHighAccuracy: true,
      interval: 3000, // 3초 간격으로 위치 요청
      fastestInterval: 2000,
      distanceFilter: 0,
    },
  );
};

/** 감시 중단 (앱 종료나 화면 전환 시) */
export const stopWatchingLocation = () => {
  if (watchId) {
    Geolocation.clearWatch(watchId);
    console.log('[GPS] 위치 감시 중단됨');
    watchId = null;
  }
};

/** 단발성 현재 위치 */
export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        console.log(`[GPS] 현재 위치: lat=${latitude}, lon=${longitude}`);
        resolve({ latitude, longitude });
      },
      err => {
        console.warn('[GPS] 현재 위치 가져오기 실패:', err);
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
};
