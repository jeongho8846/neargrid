// 📄 src/common/components/AppMapView/index.tsx
import React, { forwardRef } from 'react';
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
  return (
    <View style={styles.container}>
      <MapView
        ref={ref}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsMyLocationButton={false} // OS 기본 버튼 비활성화
        customMapStyle={MAP_STYLE_DARK} // ✅ 다크 스타일 적용
        rotateEnabled={false}
        pitchEnabled={false}
        loadingEnabled
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
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },
});
