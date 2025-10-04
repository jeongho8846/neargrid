import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

/**
 * 인스타그램 스타일 dot
 * - 가운데 dot 크고 진함
 * - 양옆으로 갈수록 점점 작고 흐릿해짐
 */
type Props = {
  idx: number;
  curPage: number;
  sizeRatio: number;
  activeColor: string;
  inactiveColor?: string;
};

const Dot: React.FC<Props> = ({
  idx,
  curPage,
  sizeRatio,
  activeColor,
  inactiveColor = '#ccc',
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const distance = Math.abs(curPage - idx);

    // 거리(distance)에 따른 크기 및 투명도 비율
    let scaleTarget = 1;
    let opacityTarget = 1;

    if (distance === 0) {
      scaleTarget = 1.0; // 현재 페이지
      opacityTarget = 1.0;
    } else if (distance === 1) {
      scaleTarget = 0.8;
      opacityTarget = 0.8;
    } else if (distance === 2) {
      scaleTarget = 0.6;
      opacityTarget = 0.6;
    } else if (distance === 3) {
      scaleTarget = 0.4;
      opacityTarget = 0.4;
    } else {
      scaleTarget = 0.25;
      opacityTarget = 0.25;
    }

    // 애니메이션 적용
    scale.value = withTiming(scaleTarget, { duration: 250 });
    opacity.value = withTiming(opacityTarget, { duration: 250 });
  }, [curPage, idx, scale, opacity]);

  const animStyle = useAnimatedStyle(() => {
    const baseSize = 7 * sizeRatio; // 기본 dot 크기
    return {
      width: baseSize * scale.value,
      height: baseSize * scale.value,
      borderRadius: (baseSize * scale.value) / 2,
      backgroundColor: scale.value > 0.8 ? activeColor : inactiveColor, // 가까울수록 진한 색
      opacity: opacity.value,
      marginHorizontal: 4 * sizeRatio,
    };
  });

  return <Animated.View style={animStyle} />;
};

export default Dot;
