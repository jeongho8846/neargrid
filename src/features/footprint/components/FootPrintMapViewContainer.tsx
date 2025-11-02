import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import { Region } from 'react-native-maps';
import AppMapView from '@/common/components/AppMapView';
import MapThreadMarker from '@/features/map/components/MapThreadMarker'; // ✅ 기존 마커 재활용
import { COLORS } from '@/common/styles/colors';
import AppText from '@/common/components/AppText';
import { useLocationStore } from '@/features/location/state/locationStore';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { clusterMarkersByScreen } from '@/utils/mapUtils';
import AppMapCurrentMarker from '@/common/components/AppMapView/markers/AppMapCurrentMarker';

export type FootPrintMapViewContainerRef = {
  zoomIn: () => void;
  zoomOut: () => void;
  moveToCurrent: () => void;
};

type Props = {
  memberId?: string;
  threads: any[];
  isLoading: boolean;
  onMarkerPress?: (ids: string[]) => void;
};

/**
 * ✅ FootPrintMapViewContainer
 * - FootPrintScreen 전용 지도 컴포넌트
 * - API 호출은 외부(FootPrintScreen)에서 처리
 */
const FootPrintMapViewContainer = forwardRef<
  FootPrintMapViewContainerRef,
  Props
>(({ memberId, threads, isLoading, onMarkerPress }, ref) => {
  const mapRef = useRef<any>(null);
  const zoomRef = useRef(0.05);
  const { latitude, longitude } = useLocationStore();
  const { member } = useCurrentMember();
  const [region, setRegion] = useState<Region | null>(null);
  const [clusters, setClusters] = useState<any[][]>([]);

  /** ✅ 지도 컨트롤 (외부 제어용) */
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
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
    },
    zoomOut: () => {
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
    },
    moveToCurrent: () => {
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
    },
  }));

  /** ✅ 지도 이동 완료 시 클러스터링 계산 */
  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    InteractionManager.runAfterInteractions(async () => {
      if (mapRef.current && threads.length > 0) {
        const grouped = await clusterMarkersByScreen(mapRef, threads, 35);
        setClusters(grouped);
      }
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
        {/* ✅ 현재 위치 표시 */}
        {latitude && longitude && (
          <AppMapCurrentMarker latitude={latitude} longitude={longitude} />
        )}

        {/* ✅ 클러스터 마커 표시 */}
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
                onPress={() => onMarkerPress?.([t.threadId])}
              />
            );
          }

          // ✅ 여러 개 묶인 경우 → 평균 좌표 + count 표시
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
              onPress={() => onMarkerPress?.(group.map(t => t.threadId))}
            />
          );
        })}
      </AppMapView>

      {/* ✅ 로딩 표시 */}
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator color={COLORS.button_active} size="large" />
          <AppText i18nKey="STR_MAP_LOADING" variant="caption" />
        </View>
      )}
    </View>
  );
});

export default FootPrintMapViewContainer;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loader: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
