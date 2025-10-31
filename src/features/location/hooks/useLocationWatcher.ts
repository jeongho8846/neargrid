// src/features/location/hooks/useLocationWatcher.ts
import { useEffect, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { useLocationStore } from '../state/locationStore';

export const useLocationWatcher = (enabled: boolean) => {
  const { setLocation } = useLocationStore();
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return; // ❌ 권한 없으면 실행 안 함

    console.log('[LocationWatcher] 시작');

    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const { latitude, longitude, altitude } = position.coords;
        // console.log(
        //   `[GPS] 위치 갱신 → lat: ${latitude}, lon: ${longitude}, alt: ${altitude}, speed: ${speed}`,
        // );
        setLocation(latitude, longitude, altitude ?? null);
      },
      error => {
        console.warn('[GPS] 감시 에러:', error);
      },
      {
        enableHighAccuracy: true,
        interval: 3000,
        fastestInterval: 2000,
        distanceFilter: 0,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
        console.log('[LocationWatcher] 중단됨');
      }
    };
  }, [enabled, setLocation]);
};
