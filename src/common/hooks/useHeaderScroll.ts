// 📄 src/common/hooks/useHeaderScroll.ts
import {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

/**
 * ✅ 개선된 useHeaderScroll
 * - 미세한 움직임 무시 (threshold)
 * - withSpring 기반 부드러운 전환
 * - scrollY도 interpolation에만 사용
 */
export const useHeaderScroll = (headerHeight = 56) => {
  const scrollY = useSharedValue(0);
  const prevY = useSharedValue(0);
  const direction = useSharedValue<'up' | 'down'>('down');
  const visible = useSharedValue(true);

  const THRESHOLD = 8; // ✅ 미세 스크롤 무시
  const MIN_DELTA = 12; // ✅ 방향 반전 최소 거리

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const y = event.contentOffset.y;
      const diff = y - prevY.value;

      // 방향 감지 + threshold 처리
      if (Math.abs(diff) > THRESHOLD) {
        if (diff > 0 && direction.value !== 'down') {
          direction.value = 'down';
        } else if (diff < 0 && direction.value !== 'up') {
          direction.value = 'up';
        }
      }

      // 일정 거리 이상 이동했을 때만 visible 상태 전환
      if (Math.abs(diff) > MIN_DELTA) {
        visible.value = direction.value === 'up';
      }

      prevY.value = y;
      scrollY.value = y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const translateY = withSpring(visible.value ? 0 : -headerHeight, {
      damping: 150,
      stiffness: 150,
    });

    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight],
      [1, 0.9],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return { scrollHandler, headerStyle, scrollY, direction, visible };
};
