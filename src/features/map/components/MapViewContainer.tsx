import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Region } from 'react-native-maps';
import AppMapView from '@/common/components/AppMapView';
import AppMapCurrentLocationButton from '@/common/components/AppMapView/controls/AppMapCurrentLocationButton';
import AppMapZoomControls from '@/common/components/AppMapView/controls/AppMapZoomControls';
import AppMapSearchHereButton from '@/common/components/AppMapView/controls/AppMapSearchHereButton';
import AppMapCurrentMarker from '@/common/components/AppMapView/markers/AppMapCurrentMarker';
import MapThreadMarker from '@/features/map/components/MapThreadMarker';
import { useLocationStore } from '@/features/location/state/locationStore';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useFetchMapThreads } from '@/features/map/hooks/useFetchMapThreads';
import { calcMapSearchRadius, getMapCenter } from '@/utils/mapUtils';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import AppText from '@/common/components/AppText';

const DEFAULT_COORDS = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MapViewContainer = () => {
  const mapRef = useRef<any>(null);
  const zoomRef = useRef(0.05);
  const { latitude, longitude } = useLocationStore();
  const { member } = useCurrentMember();
  const { threads, loading, fetchThreads } = useFetchMapThreads();
  const [region, setRegion] = useState<Region>(DEFAULT_COORDS);

  // 지도 이동 끝나면 region 저장
  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  // 현재 위치 바뀌면 지도만 이동 (검색 X)
  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: zoomRef.current,
          longitudeDelta: zoomRef.current,
        },
        800,
      );
    }
  }, [latitude, longitude]);

  // 이 위치에서 검색
  const handleSearchHere = async () => {
    const radius = calcMapSearchRadius(region);
    const { latitude: centerLat, longitude: centerLon } = getMapCenter(region);

    await fetchThreads({
      latitude: centerLat,
      longitude: centerLon,
      distance: radius,
      memberId: member?.id ?? '',
    });
  };

  // 현재위치로 이동
  const handleMoveToCurrent = () => {
    if (!latitude || !longitude || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: zoomRef.current,
        longitudeDelta: zoomRef.current,
      },
      800,
    );
  };

  // 줌
  const handleZoomIn = () => {
    zoomRef.current = Math.max(zoomRef.current * 0.5, 0.002);
    mapRef.current?.animateToRegion(
      {
        ...region,
        latitudeDelta: zoomRef.current,
        longitudeDelta: zoomRef.current,
      },
      300,
    );
  };

  const handleZoomOut = () => {
    zoomRef.current = Math.min(zoomRef.current * 2, 1);
    mapRef.current?.animateToRegion(
      {
        ...region,
        latitudeDelta: zoomRef.current,
        longitudeDelta: zoomRef.current,
      },
      300,
    );
  };

  return (
    <View style={styles.container}>
      <AppMapView
        ref={mapRef}
        initialRegion={DEFAULT_COORDS}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {/* 내 위치 */}
        {latitude && longitude && (
          <AppMapCurrentMarker latitude={latitude} longitude={longitude} />
        )}

        {/* 서버에서 온 마커들 */}
        {threads.map(thread => (
          <MapThreadMarker
            key={thread.threadId}
            latitude={thread.latitude}
            longitude={thread.longitude}
            imageUrl={thread.markerImageUrl}
            reactionCount={thread.reactionCount}
            onPress={() => console.log('[Marker Pressed]', thread.threadId)}
          />
        ))}
      </AppMapView>

      {/* 컨트롤러 */}
      <AppMapCurrentLocationButton onPress={handleMoveToCurrent} />
      <AppMapZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      <AppMapSearchHereButton onPress={handleSearchHere} isLoading={loading} />
    </View>
  );
};

export default MapViewContainer;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
});
