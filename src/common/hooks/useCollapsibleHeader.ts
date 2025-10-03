import { useRef, useState } from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Collapsible Header Hook
 * - headerHeight: 스크린별 헤더 높이
 * - SafeAreaInsets.top 포함
 * - headerOffset: 애니메이션 값
 * - isAtTop: 스크롤 최상단 여부
 */
export const useCollapsibleHeader = (headerHeight: number = 56) => {
  const insets = useSafeAreaInsets();
  const HEADER_TOTAL = headerHeight + insets.top;

  const headerOffset = useRef(new Animated.Value(0)).current;
  const offsetValueRef = useRef(0);
  const lastY = useRef(0);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    const diff = currentY - lastY.current;

    let newOffset = offsetValueRef.current - diff;
    newOffset = Math.min(0, Math.max(-HEADER_TOTAL, newOffset));

    headerOffset.setValue(newOffset);
    offsetValueRef.current = newOffset;
    lastY.current = currentY;

    // ✅ 최상단 여부 업데이트
    if (currentY <= 0 && !isAtTop) {
      setIsAtTop(true);
    } else if (currentY > 0 && isAtTop) {
      setIsAtTop(false);
    }
  };

  return { headerOffset, handleScroll, HEADER_TOTAL, isAtTop };
};
