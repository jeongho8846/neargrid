import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Dot from './Dot';
import EmptyDot, { defaultEmptyDotSize } from './EmptyDot';
import usePrevious from '@/common/hooks/usePrevious';
import { COLORS } from '@/common/styles/colors';

type Props = {
  curPage: number;
  maxPage: number;
  sizeRatio?: number;
  activeDotColor?: string;
  inactiveDotColor?: string;
  vertical?: boolean;
};

const ONE_EMPTY_DOT_SIZE = defaultEmptyDotSize * defaultEmptyDotSize;

/**
 * DotIndicator
 * - 중앙 dot 크게, 양끝 dot은 작고 희미
 * - 인스타그램 스타일 슬라이드 인디케이터
 */
const DotIndicator: React.FC<Props> = ({
  curPage,
  maxPage,
  sizeRatio = 1,
  activeDotColor = COLORS.dot_active,
  inactiveDotColor = COLORS.dot_inactive,
  vertical = false,
}) => {
  const refScrollView = useRef<ScrollView>(null);
  const prevPage = usePrevious(curPage);

  const safeSizeRatio = Math.max(1.0, sizeRatio);

  const scrollTo = useCallback(
    (index: number, animated = true) => {
      if (!refScrollView.current) return;

      const sizeRatio = safeSizeRatio;
      const FIRST_EMPTY_DOT_SPACE = ONE_EMPTY_DOT_SIZE * 2;
      const MOVE_DISTANCE = ONE_EMPTY_DOT_SIZE * sizeRatio;

      // 🔥 인스타그램 규칙: curPage가 늘어날 때는 오른쪽 두 번째 dot,
      // 줄어들 때는 왼쪽 두 번째 dot이 기준이 되도록 offset 계산
      const middleIndex = 3; // 화면에 보여줄 기준점 (중앙 근처)
      const moveTo = Math.max(
        0,
        FIRST_EMPTY_DOT_SPACE + (index - middleIndex) * MOVE_DISTANCE,
      );

      if (vertical) {
        refScrollView.current.scrollTo({ x: 0, y: moveTo, animated });
      } else {
        refScrollView.current.scrollTo({ x: moveTo, y: 0, animated });
      }
    },
    [safeSizeRatio, vertical],
  );

  useEffect(() => {
    if (maxPage > 4 && prevPage !== curPage) scrollTo(curPage);
  }, [curPage, maxPage, prevPage, scrollTo]);

  const list = useMemo(() => [...Array(maxPage).keys()], [maxPage]);

  let normalizedPage = Math.max(0, Math.min(curPage, maxPage - 1));

  const container: StyleProp<ViewStyle> = {
    alignItems: 'center',
    flexDirection: vertical ? 'column' : 'row',
    maxHeight: vertical ? 84 * safeSizeRatio : undefined,
    maxWidth: vertical ? undefined : 84 * safeSizeRatio,
  };

  return (
    <View style={container} onLayout={() => scrollTo(curPage, false)}>
      <ScrollView
        ref={refScrollView}
        contentContainerStyle={styles.scrollViewContainer}
        bounces={false}
        horizontal={!vertical}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {/* 앞쪽 dummy */}
        <EmptyDot sizeRatio={safeSizeRatio} />
        <EmptyDot sizeRatio={safeSizeRatio} />

        {list.map(i => (
          <Dot
            key={i}
            idx={i}
            sizeRatio={safeSizeRatio}
            curPage={normalizedPage}
            activeColor={activeDotColor}
            inactiveColor={inactiveDotColor}
          />
        ))}

        {/* 뒤쪽 dummy */}
        <EmptyDot sizeRatio={safeSizeRatio} />
        <EmptyDot sizeRatio={safeSizeRatio} />
      </ScrollView>
    </View>
  );
};

export default DotIndicator;

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',

    paddingHorizontal: 0, // ✅ 끝 dot 잘림 방지
  },
});
