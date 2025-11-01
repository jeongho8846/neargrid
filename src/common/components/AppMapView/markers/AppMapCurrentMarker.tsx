import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { COLORS } from '@/common/styles/colors';

type Props = {
  latitude: number;
  longitude: number;
};

const AppMapCurrentMarker = ({ latitude, longitude }: Props) => {
  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={10}
    >
      {/* 외곽 원 */}
      <View style={styles.outerCircle}>
        {/* 내부 중심점 */}
        <View style={styles.innerDot} />
      </View>
    </Marker>
  );
};

export default AppMapCurrentMarker;

const styles = StyleSheet.create({
  outerCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(30, 144, 255, 0.2)', // 연한 블루 외곽
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(30, 144, 255, 0.5)',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brand || '#1E90FF', // 중앙 포인트 (브랜드 블루)
  },
});
