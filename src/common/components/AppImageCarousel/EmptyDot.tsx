import React from 'react';
import { View, StyleSheet } from 'react-native';

export const defaultEmptyDotSize = 3;

/**
 * 더미 dot (자리 차지용, 화면에는 보이지 않음)
 */
const EmptyDot: React.FC<{ sizeRatio: number }> = ({ sizeRatio }) => {
  return (
    <View
      style={[
        styles.base,
        {
          width: defaultEmptyDotSize * sizeRatio,
          height: defaultEmptyDotSize * sizeRatio,
          margin: defaultEmptyDotSize * sizeRatio,
        },
      ]}
    />
  );
};

export default EmptyDot;

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'white',
    opacity: 0, // ✅ 완전 투명
  },
});
