import { create } from 'zustand';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  setLocation: (lat: number, lon: number, alt: number | null) => void;
};

export const useLocationStore = create<LocationState>(set => ({
  latitude: null,
  longitude: null,
  altitude: null,
  setLocation: (latitude, longitude, altitude) => {
    // console.log('📍 [useLocationStore] setLocation 호출:', {
    //   latitude,
    //   longitude,
    //   altitude,
    // });
    set({ latitude, longitude, altitude });
  },
}));
