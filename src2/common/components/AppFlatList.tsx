import React, { useRef } from 'react';
import {
  FlatList,
  FlatListProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useHeaderStore } from '@/common/state/headerStore';
import { useTabBarStore } from '@/common/state/tabBarStore';

type Props<T> = FlatListProps<T> & {
  /** 헤더 자동 숨김 여부 */
  headerAutoHide?: boolean;
  /** 탭바 자동 숨김 여부 */
  tabBarAutoHide?: boolean;
};

export default function AppFlatList<T>({
  headerAutoHide = false,
  tabBarAutoHide = false,
  ...rest
}: Props<T>) {
  const lastOffsetY = useRef(0);
  const setHeaderVisible = useHeaderStore(s => s.setVisible);
  const setTabBarVisible = useTabBarStore(s => s.setVisible);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const diff = offsetY - lastOffsetY.current;

    if (Math.abs(diff) > 5) {
      const scrollingDown = diff > 0;

      if (headerAutoHide) setHeaderVisible(!scrollingDown);
      if (tabBarAutoHide) setTabBarVisible(!scrollingDown);
    }

    lastOffsetY.current = offsetY;
  };

  return (
    <FlatList
      {...rest}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    />
  );
}
