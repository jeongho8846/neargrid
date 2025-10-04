import React, { useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
} from 'react-native';
import AppZoomableImage from '../AppZoomableImage';
import DotIndicator from './DotIndicator';
import { COLORS } from '@/common/styles/colors';

const { width } = Dimensions.get('window');

type Props = {
  images: string[];
  height?: number; // 기본 이미지 높이
};

const AppImageCarousel: React.FC<Props> = ({ images, height = 300 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / width);
    setActiveIndex(Math.max(0, Math.min(idx, images.length - 1)));
  };

  return (
    <View style={{ width, height }}>
      {/* ✅ 이미지 리스트 */}
      <FlatList
        data={images}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <AppZoomableImage source={{ uri: item }} style={{ width, height }} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        style={{ height }}
      />

      {/* ✅ 숫자 카운터 (사진 우측 상단 겹치게) */}
      {images.length > 1 && (
        <View style={styles.counterWrap}>
          <View style={styles.counterBox}>
            <Text style={styles.counterText}>
              {activeIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      )}

      {/* ✅ 이미지 밑에 dot indicator */}
      {images.length > 1 && (
        <View style={styles.dotWrap}>
          <DotIndicator
            curPage={activeIndex}
            maxPage={images.length}
            activeDotColor={COLORS.dot_active}
            inactiveDotColor={COLORS.dot_inactive}
          />
        </View>
      )}
    </View>
  );
};

export default AppImageCarousel;

const styles = StyleSheet.create({
  dotWrap: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  counterWrap: {
    position: 'absolute',
    top: 8,
    right: 12,
  },
  counterBox: {
    backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 배경
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
