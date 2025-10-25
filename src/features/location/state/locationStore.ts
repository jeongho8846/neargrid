// src/features/location/state/locationStore.ts
import { create } from 'zustand';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  setLocation: (lat: number, lon: number, alt?: number | null) => void;
  clearLocation: () => void;
};

export const useLocationStore = create<LocationState>(set => ({
  latitude: null,
  longitude: null,
  altitude: null,

  setLocation: (lat, lon, alt = null) => {
    // console.log('📍 위치 저장됨:', {
    //   latitude: lat,
    //   longitude: lon,
    //   altitude: alt,
    // });
    set({ latitude: lat, longitude: lon, altitude: alt });
  },

  clearLocation: () => {
    console.log('🧹 위치 정보 초기화됨');
    set({ latitude: null, longitude: null, altitude: null });
  },
}));
