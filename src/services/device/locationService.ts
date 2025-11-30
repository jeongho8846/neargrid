// src/features/location/utils/locationWatcher.ts
import Geolocation from '@react-native-community/geolocation';
import { useLocationStore } from '@/features/location/state/locationStore';

let watchId: number | null = null;

/** 앱 시작 시 3초마다 위치 추적 시작 (latitude / longitude / altitude 모두 저장) */
export const startWatchingLocation = () => {
  const { setLocation } = useLocationStore.getState();

  if (watchId) return; // ✅ 중복 실행 방지

  watchId = Geolocation.watchPosition(
    position => {
      const { latitude, longitude, altitude } = position.coords;
      setLocation(latitude, longitude, altitude ?? null);
      // console.log(
      //   `[GPS] 위치 갱신 → lat: ${latitude}, lon: ${longitude}, alt: ${altitude}`,
      // );
    },
    error => {
      console.warn('[GPS] 감시 에러:', error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 3, // 3미터 이동할 때마다 업데이트
      interval: 1000,
      fastestInterval: 1000,
    },
  );
};

/** 감시 중단 (앱 종료나 화면 전환 시) */
export const stopWatchingLocation = () => {
  if (watchId) {
    Geolocation.clearWatch(watchId);
    Geolocation.stopObserving?.();
    console.log('[GPS] 위치 감시 중단됨');
    watchId = null;
  }
};

/** 단발성 현재 위치 가져오기 (고도 포함) */
export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
  altitude: number | null;
}> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, altitude } = pos.coords;
        // console.log(
        //   `[GPS] 현재 위치: lat=${latitude}, lon=${longitude}, alt=${altitude}`,
        // );
        resolve({
          latitude,
          longitude,
          altitude: altitude ?? null,
        });
      },
      err => {
        console.warn('[GPS] 현재 위치 가져오기 실패:', err);
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
};

/** 위치 권한 요청 (iOS 설정에 앱이 뜨게 하기 위함) */
