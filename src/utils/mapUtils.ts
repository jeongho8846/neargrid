// 📄 src/utils/mapUtils.ts

/**
 * ✅ 지도 중심 기준 검색 반경 계산 유틸
 * - region.latitudeDelta 값(세로길이)에 따라 거리 계산
 * - Google Maps / react-native-maps 공통 구조 사용
 */

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

/**
 * 위도 1도 ≈ 111,320m
 */
const METERS_PER_LAT_DEGREE = 111_320;

/**
 * 지도 region 데이터를 받아 검색 반경(m 단위) 계산
 * @param region react-native-maps Region 객체
 * @returns radiusMeters (미터 단위 반경)
 */
export function calcMapSearchRadius(region: MapRegion): number {
  if (!region?.latitudeDelta) return 0;
  // 세로 길이(Δlat)의 절반 * 위도 1도당 거리
  return (region.latitudeDelta / 2) * METERS_PER_LAT_DEGREE;
}

/**
 * 지도 중심 좌표를 반환
 * - 서버에 보낼 latitude, longitude 값
 */
export function getMapCenter(region: MapRegion) {
  return {
    latitude: region.latitude,
    longitude: region.longitude,
  };
}
