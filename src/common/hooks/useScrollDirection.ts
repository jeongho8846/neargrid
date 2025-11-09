// 📄 src/common/hooks/useScrollDirection.ts
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

/**
 * ✅ useScrollDirection
 * - 스크롤 방향(up/down)을 실시간 감지
 * - 모든 계산은 native-thread에서 실행됨 (JS 부하 없음)
 * - 헤더나 탭바 반응형 애니메이션에 재활용 가능
 *
 * 예시:
 * const { direction, scrollHandler } = useScrollDirection();
 * <Animated.FlatList onScroll={scrollHandler} />
 */
export const useScrollDirection = () => {
  const prevY = useSharedValue(0);
  const direction = useSharedValue<'up' | 'down'>('down');

  // ✅ native-thread scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const y = event.contentOffset.y;

      if (y > prevY.value + 2) {
        direction.value = 'down';
      } else if (y < prevY.value - 2) {
        direction.value = 'up';
      }

      prevY.value = y;
    },
  });

  return {
    scrollHandler, // FlashList/FlatList에 연결
    direction, // 공유 상태: up | down
  };
};
