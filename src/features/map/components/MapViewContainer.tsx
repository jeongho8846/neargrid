// 📄 src/features/map/components/MapViewContainer.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import { Region } from 'react-native-maps';
import AppMapView from '@/common/components/AppMapView';
import MapThreadMarker from './MapThreadMarker';
import { COLORS } from '@/common/styles/colors';
import AppMapCurrentMarker from '@/common/components/AppMapView/markers/AppMapCurrentMarker';
import AppMapZoomControls from '@/common/components/AppMapView/controls/AppMapZoomControls';
import AppMapCurrentLocationButton from '@/common/components/AppMapView/controls/AppMapCurrentLocationButton';
import AppMapSearchHereButton from '@/common/components/AppMapView/controls/AppMapSearchHereButton';
import AppText from '@/common/components/AppText';
import { useFetchMapThreads } from '../hooks/useFetchMapThreads';
import { useLocationStore } from '@/features/location/state/locationStore';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import {
  clusterMarkersByScreen,
  calcMapSearchRadius,
  getMapCenter,
} from '@/utils/mapUtils';

const MapViewContainer = () => {
  const mapRef = useRef<any>(null);
  const zoomRef = useRef(0.05);
  const { latitude, longitude } = useLocationStore();
  const { member } = useCurrentMember();
  const { threads, loading, fetchThreads } = useFetchMapThreads();
  const [region, setRegion] = useState<Region | null>(null);
  const [clusters, setClusters] = useState<any[][]>([]);

  // 🔍 확대 / 축소 (줌 값은 검색 반경에도 영향 줌)
  const handleZoomIn = () => {
    if (!region) return;
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
    if (!region) return;
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

  // 🧭 지도 이동 후 → 화면 기준 클러스터링
  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);

    InteractionManager.runAfterInteractions(async () => {
      if (mapRef.current && threads.length > 0) {
        const grouped = await clusterMarkersByScreen(mapRef, threads, 35);
        setClusters(grouped);
      }
    });
  };

  // 📍 현재 위치로 이동
  const handleMoveToCurrent = () => {
    if (!latitude || !longitude || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: zoomRef.current,
        longitudeDelta: zoomRef.current,
      },
      600,
    );
  };

  // 🔍 이 위치에서 다시 검색 (← 여기서 "줌 = 반경" 사용)
  const handleSearchHere = async () => {
    if (!region) return;

    // ✅ 1. 중심좌표
    const { latitude: centerLat, longitude: centerLon } = getMapCenter(region);
    // ✅ 2. 현재 줌 기준 반경(m)
    const radius = calcMapSearchRadius(region);

    await fetchThreads({
      latitude: centerLat,
      longitude: centerLon,
      distance: radius, // ✅ 이거 다시 넣음
      memberId: member?.id ?? '',
    });
  };

  return (
    <View style={styles.container}>
      <AppMapView
        ref={mapRef}
        initialRegion={{
          latitude: 37.5665,
          longitude: 126.978,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {/* 내 위치 */}
        {latitude && longitude && (
          <AppMapCurrentMarker latitude={latitude} longitude={longitude} />
        )}

        {/* 클러스터 / 단일 마커 */}
        {clusters.map((group, i) => {
          if (group.length === 1) {
            const t = group[0];
            return (
              <MapThreadMarker
                key={t.threadId}
                latitude={t.latitude}
                longitude={t.longitude}
                imageUrl={t.markerImageUrl}
                profileImageUrl={t.memberProfileImageUrl}
              />
            );
          }

          // 여러 개일 경우 → 대표 표시 (ex. 배지)
          const avgLat =
            group.reduce((sum, g) => sum + g.latitude, 0) / group.length;
          const avgLon =
            group.reduce((sum, g) => sum + g.longitude, 0) / group.length;
          const representative = group[0];

          return (
            <MapThreadMarker
              key={`cluster-${i}`}
              latitude={avgLat}
              longitude={avgLon}
              imageUrl={representative.markerImageUrl}
              profileImageUrl={representative.memberProfileImageUrl}
              reactionCount={group.length}
            />
          );
        })}
      </AppMapView>

      {/* 컨트롤러 */}
      <AppMapCurrentLocationButton onPress={handleMoveToCurrent} />
      <AppMapZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      <AppMapSearchHereButton onPress={handleSearchHere} isLoading={loading} />

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator color={COLORS.button_active} size="large" />
          <AppText i18nKey="STR_MAP_LOADING" variant="caption" />
        </View>
      )}
    </View>
  );
};

export default MapViewContainer;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loader: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
