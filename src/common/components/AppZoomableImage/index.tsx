import React from 'react';
import {
  StyleSheet,
  StyleProp,
  ImageStyle,
  LayoutChangeEvent,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import FastImage, { Source, ResizeMode } from '@d11/react-native-fast-image';
import { COLORS } from '@/common/styles';

type Props = {
  source: Source; // ✅ FastImage 전용 타입
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode; // ✅ FastImage의 enum 타입
  revertOnEnd?: boolean;
  maxScale?: number;
};

const AppZoomableImage: React.FC<Props> = ({
  source,
  style,
  resizeMode = FastImage.resizeMode.cover,
  revertOnEnd = true,
  maxScale = 3,
}) => {
  const viewWidth = useSharedValue(0);
  const viewHeight = useSharedValue(0);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const startScale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    viewWidth.value = e.nativeEvent.layout.width;
    viewHeight.value = e.nativeEvent.layout.height;
  };

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(e => {
      if (e.numberOfPointers < 2) return;

      let nextScale = startScale.value * e.scale;
      if (nextScale < 1) nextScale = 1;
      if (nextScale > maxScale) nextScale = maxScale;

      const ratio = nextScale / startScale.value;

      const cx = viewWidth.value / 2;
      const cy = viewHeight.value / 2;

      const dx = (cx - e.focalX) * (ratio - 1);
      const dy = (cy - e.focalY) * (ratio - 1);

      translateX.value = startX.value + dx;
      translateY.value = startY.value + dy;
      scale.value = nextScale;
    })
    .onEnd(() => {
      if (revertOnEnd) {
        scale.value = withTiming(1, { duration: 250 });
        translateX.value = withTiming(0, { duration: 250 });
        translateY.value = withTiming(0, { duration: 250 });
      } else {
        scale.value = withSpring(scale.value, { damping: 15, stiffness: 120 });
        translateX.value = withSpring(translateX.value, {
          damping: 15,
          stiffness: 120,
        });
        translateY.value = withSpring(translateY.value, {
          damping: 15,
          stiffness: 120,
        });
      }
    });

  const pan = Gesture.Pan()
    .minPointers(2)
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(e => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      if (revertOnEnd) {
        translateX.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
      } else {
        translateX.value = withSpring(translateX.value, {
          damping: 15,
          stiffness: 120,
        });
        translateY.value = withSpring(translateY.value, {
          damping: 15,
          stiffness: 120,
        });
      }
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={composed}>
        <Animated.View style={styles.wrapper} onLayout={onLayout}>
          <Animated.View style={animatedStyle}>
            <FastImage
              source={source}
              style={[styles.image, style]}
              resizeMode={resizeMode}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    flex: 1,
    backgroundColor: COLORS.emty_imageBox,
  },
});

export default AppZoomableImage;
