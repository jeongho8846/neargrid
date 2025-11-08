import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AppImage from './AppImage';
import { COLORS, SPACING } from '../styles/tokens';

const { width } = Dimensions.get('window');

type Props = {
  images: string[];
  height?: number;
};

export default function AppCarousel({ images, height = 240 }: Props) {
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList<string>>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / width);
    if (newIndex !== index) setIndex(newIndex);
  };

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatRef}
        data={images}
        renderItem={({ item }) => (
          <AppImage
            source={{ uri: item }}
            style={{ width, height }}
            resizeMode="cover"
          />
        )}
        keyExtractor={(item, i) => `${item}-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        decelerationRate="fast" // ✅ 빠르게 멈추기
        snapToInterval={width} // ✅ 한 페이지당 width 단위로 스냅
        snapToAlignment="center"
      />
      <View style={styles.dotContainer}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                opacity: i === index ? 1 : 0.3,
                backgroundColor: COLORS.primary,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dotContainer: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
