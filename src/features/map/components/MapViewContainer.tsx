import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useMapRegion } from '../hooks/useMapRegion';

/**
 * 🧭 MapViewContainer
 * - 지도 렌더링 및 중심 좌표 관리
 * - useMapRegion 훅과 연동 (Zustand 위치 스토어 기반)
 */
const MapViewContainer = () => {
  const { region, handleRegionChange } = useMapRegion();

  //   useEffect(() => {
  //     if (center) {
  //       console.log('[MapViewContainer] 중심 좌표:', center);
  //     }
  //   }, [center]);

  // 📍 아직 region이 초기화되지 않았다면 렌더링 지연
  if (!region) return null;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(r: Region) => handleRegionChange(r)}
        showsUserLocation
        showsMyLocationButton
      />
    </View>
  );
};

export default MapViewContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
