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
import FastImage from '@d11/react-native-fast-image';
import AppZoomableImage from '../AppZoomableImage';
import DotIndicator from './DotIndicator';
import Skeleton from 'react-native-reanimated-skeleton';
import { COLORS } from '@/common/styles/colors';

const { width } = Dimensions.get('window');

type Props = {
  images: string[];
  height?: number;
  prefetchCount?: number;
  isLoading?: boolean;
};

const AppImageCarousel: React.FC<Props> = ({
  images,
  height = 300,
  prefetchCount = 2,
  isLoading = false,
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

  /** ✅ 초기 prefetch */
  useEffect(() => {
    if (!isLoading && images.length > 1) {
      prefetchNextImages(0);
    }
  }, [images, isLoading]);

  return (
    <View style={{ width, height }}>
      {/* ✅ 로딩 중 Skeleton */}
      {isLoading ? (
        <Skeleton
          isLoading
          hasFadeIn
          duration={1200}
          animationType="pulse"
          boneColor={COLORS.skeleton_bone_light} // ✅ 공용 색상 (light/dark 자동 대응)
          highlightColor={COLORS.skeleton_highlight_light}
          containerStyle={styles.skeletonContainer}
          layout={[
            {
              key: 'imageSkeleton',
              width: '100%',
              height,
              borderRadius: 8,
            },
          ]}
        />
      ) : (
        <>
          {/* ✅ 이미지 리스트 */}
          <FlatList
            data={images}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <AppZoomableImage
                source={{ uri: item }}
                style={{ width, height }}
                isLoading={false}
              />
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            style={{ height }}
          />

          {/* ✅ 이미지 카운터 */}
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
        </>
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
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  skeletonContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background, // ✅ 투명 대신 테마 배경색
  },
});
