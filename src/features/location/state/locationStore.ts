// src/features/location/state/locationStore.ts
import { create } from 'zustand';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  setLocation: (lat: number, lon: number) => void;
  clearLocation: () => void;
};

export const useLocationStore = create<LocationState>(set => ({
  latitude: null,
  longitude: null,

  setLocation: (lat, lon) => {
    console.log('📍 위치 저장됨:', { latitude: lat, longitude: lon });
    set({ latitude: lat, longitude: lon });
  },

  clearLocation: () => {
    console.log('🧹 위치 정보 초기화됨');
    set({ latitude: null, longitude: null });
  },
}));
