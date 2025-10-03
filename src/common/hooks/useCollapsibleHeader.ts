import { useRef } from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 공용 Collapsible Header 훅
 * - headerHeight를 파라미터로 받아서 스크린별 해더 높이 다르게 처리 가능
 * - SafeAreaInsets.top 포함
 */
export const useCollapsibleHeader = (headerHeight: number = 56) => {
  const insets = useSafeAreaInsets();
  const HEADER_TOTAL = headerHeight + insets.top;

  const headerOffset = useRef(new Animated.Value(0)).current;
  const offsetValueRef = useRef(0); // ✅ 현재 offset 값을 별도로 추적
  const lastY = useRef(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    const diff = currentY - lastY.current;

    let newOffset = offsetValueRef.current - diff;

    // ✅ clamp (0 ~ -HEADER_TOTAL)
    newOffset = Math.min(0, Math.max(-HEADER_TOTAL, newOffset));

    headerOffset.setValue(newOffset);
    offsetValueRef.current = newOffset; // ✅ ref 갱신
    lastY.current = currentY;
  };

  return { headerOffset, handleScroll, HEADER_TOTAL };
};
