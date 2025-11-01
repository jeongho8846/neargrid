// 📄 src/common/components/AppMapView/index.tsx
import React, { forwardRef, useMemo } from 'react';
import MapView, { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@/common/styles/colors';
import { MAP_STYLE_DARK } from './mapStyleDark';

/**
 * ✅ AppMapView
 * - 모든 지도 화면에서 공용으로 사용하는 베이스 MapView
 * - showsUserLocation 기본 활성화
 * - 외부에서 ref로 제어 가능 (animateToRegion 등)
 */
type Props = MapViewProps & {
  children?: React.ReactNode;
};

const AppMapView = forwardRef<MapView, Props>(({ children, ...props }, ref) => {
  /** ✅ 1. 스타일 메모이제이션 — 줌 시 깜빡임 방지 */
  const mapStyle = useMemo(() => MAP_STYLE_DARK, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={ref}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsMyLocationButton={false}
        customMapStyle={mapStyle} // ✅ 고정된 참조 사용
        rotateEnabled={false}
        pitchEnabled={false}
        loadingEnabled={false} // ✅ 로딩시 흰색 플래시 방지
        mapType="standard"
        liteMode={false} // ✅ 안드로이드 타일 버그 방지
        {...props}
      >
        {children}
      </MapView>
    </View>
  );
});

export default AppMapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // ✅ 배경을 투명하게 만들어 타일 로딩시 하얀색 방지
    backgroundColor: 'transparent',
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent', // ✅ 내부 MapView도 투명
  },
});
