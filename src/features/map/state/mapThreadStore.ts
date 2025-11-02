import { create } from 'zustand';
import type { MapThreadMarkerData } from '../hooks/useFetchMapThreads';

type MapThreadStore = {
  threads: MapThreadMarkerData[];
  setThreads: (data: MapThreadMarkerData[]) => void;
  clearThreads: () => void;
};

export const useMapThreadStore = create<MapThreadStore>(set => ({
  threads: [],
  setThreads: data => set({ threads: data }),
  clearThreads: () => set({ threads: [] }),
}));
