import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image'; // ✅ prefetch용 import
import AppZoomableImage from '../AppZoomableImage';
import DotIndicator from './DotIndicator';
import { COLORS } from '@/common/styles/colors';

const { width } = Dimensions.get('window');

type Props = {
  images: string[];
  height?: number;
  prefetchCount?: number; // ✅ 다음 몇 장을 미리 캐싱할지 설정 가능 (기본 2)
};

const AppImageCarousel: React.FC<Props> = ({
  images,
  height = 300,
  prefetchCount = 2,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  /** ✅ 다음 이미지 prefetch */
  const prefetchNextImages = (currentIndex: number) => {
    const nextBatch = images.slice(
      currentIndex + 1,
      currentIndex + 1 + prefetchCount,
    );
    if (nextBatch.length > 0) {
      FastImage.preload(nextBatch.map(uri => ({ uri })));
    }
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / width);
    const nextIndex = Math.max(0, Math.min(idx, images.length - 1));
    setActiveIndex(nextIndex);

    // ✅ 다음 이미지 캐싱
    prefetchNextImages(nextIndex);
  };

  /** ✅ 초기 진입 시 첫 번째 이미지 다음 2장 미리 캐싱 */
  useEffect(() => {
    if (images.length > 1) {
      prefetchNextImages(0);
    }
  }, [images]);

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

      {/* ✅ 숫자 카운터 */}
      {images.length > 1 && (
        <View style={styles.counterWrap}>
          <View style={styles.counterBox}>
            <Text style={styles.counterText}>
              {activeIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      )}

      {/* ✅ Dot indicator */}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
