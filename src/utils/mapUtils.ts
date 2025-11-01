/**
 * ✅ 지도 관련 유틸
 * - ① 화면 좌표 기반 클러스터링 (pointForCoordinate)
 * - ② region 기반 중심 좌표 및 검색 반경 계산
 */

/* -------------------------------------------------------------------------- */
/* 🧭 기본 타입 정의                                                          */
/* -------------------------------------------------------------------------- */

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type MapThread = {
  threadId: string;
  latitude: number;
  longitude: number;
  markerImageUrl?: string;
  memberProfileImageUrl?: string;
  reactionCount?: number;
};

/* -------------------------------------------------------------------------- */
/* 📏 검색 반경 및 중심 계산 (서버 요청용)                                    */
/* -------------------------------------------------------------------------- */

/**
 * 위도 1도 ≈ 111,320m
 */
const METERS_PER_LAT_DEGREE = 111_320;

/**
 * ✅ 지도 region 데이터를 받아 검색 반경(m 단위) 계산
 * - region.latitudeDelta(세로 길이)를 기준으로
 * - 세로길이 절반 * 위도 1도당 거리 = 반경
 */
export function calcMapSearchRadius(region: MapRegion): number {
  if (!region?.latitudeDelta) return 0;
  return (region.latitudeDelta / 2) * METERS_PER_LAT_DEGREE;
}

/**
 * ✅ 지도 중심 좌표를 반환 (서버 API 요청 시 사용)
 */
export function getMapCenter(region: MapRegion) {
  return {
    latitude: region.latitude,
    longitude: region.longitude,
  };
}

/* -------------------------------------------------------------------------- */
/* 🎯 화면 기준 클러스터링 (UI용)                                            */
/* -------------------------------------------------------------------------- */

/**
 * ✅ 화면상 좌표(pixel) 기준 클러스터링
 * - mapRef.pointForCoordinate() 사용
 * - 줌레벨, latitudeDelta 무관
 * - 실제 화면에서 겹쳐 보이는 마커만 묶음
 *
 * @param mapRef react-native-maps ref 객체
 * @param threads 마커 데이터 배열
 * @param pixelThreshold 픽셀 거리 기준 (값 낮을수록 더 가까워야 묶임)
 */
export async function clusterMarkersByScreen(
  mapRef: any,
  threads: MapThread[],
  pixelThreshold = 1, // ← 1 → 50으로 증가
): Promise<MapThread[][]> {
  if (!mapRef?.current || !threads?.length) return [];

  // 📍 모든 마커의 화면 좌표 계산
  const points = await Promise.all(
    threads.map(async t => {
      const screenPoint = await mapRef.current.pointForCoordinate({
        latitude: t.latitude,
        longitude: t.longitude,
      });
      return { ...t, screenPoint };
    }),
  );

  const clusters: MapThread[][] = [];
  const visited = new Set<string>();

  for (const t of points) {
    if (!t.screenPoint || visited.has(t.threadId)) continue;

    const cluster = [t];
    visited.add(t.threadId);

    for (const other of points) {
      if (!other.screenPoint || visited.has(other.threadId)) continue;

      const dx = t.screenPoint.x - other.screenPoint.x;
      const dy = t.screenPoint.y - other.screenPoint.y;
      const distancePx = Math.sqrt(dx * dx + dy * dy);

      if (distancePx < pixelThreshold) {
        cluster.push(other);
        visited.add(other.threadId);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}
