import { useState, useCallback, useEffect } from 'react';
import type { Region } from 'react-native-maps';
import { useLocationStore } from '@/features/location/state/locationStore';

/**
 * ✅ useMapRegion
 * - 현재 위치 스토어의 좌표를 초기 중심으로 사용
 * - 지도 이동 시 region 갱신
 */
export const useMapRegion = () => {
  const { latitude, longitude } = useLocationStore();

  const [region, setRegion] = useState<Region | null>(null);

  /** 📍 지도 이동 시 region 갱신 */
  const handleRegionChange = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  /** 🧭 위치 스토어 변경 시 지도 중심 초기화 */
  useEffect(() => {
    if (latitude && longitude && !region) {
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [latitude, longitude, region]);

  /** 📡 중심좌표만 반환 (API용) */
  const center = region
    ? { latitude: region.latitude, longitude: region.longitude }
    : latitude && longitude
    ? { latitude, longitude }
    : null;

  return {
    region,
    setRegion,
    handleRegionChange,
    center,
  };
};
