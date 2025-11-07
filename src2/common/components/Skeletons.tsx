import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/common/styles/tokens';

/* -------------------------------------------------------------------------- */
/*  ✅ SkeletonItem — Pulse 애니메이션 효과 (no gradient)                    */
/* -------------------------------------------------------------------------- */
type SkeletonItemProps = {
  children: React.ReactNode;
};

const SkeletonItem = ({ children }: SkeletonItemProps) => {
  const animValue = useRef(new Animated.Value(0)).current;

  const opacity = animValue.interpolate({
    inputRange: [0, 0.75, 1],
    outputRange: [0.3, 0.75, 1],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [animValue]);

  return (
    <Animated.View style={[styles.animatedItem, { opacity }]}>
      {children}
    </Animated.View>
  );
};

/* -------------------------------------------------------------------------- */
/*  ✅ 기본 블록 — SkeletonBase                                              */
/* -------------------------------------------------------------------------- */
type SkeletonBaseProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginTop?: number;
};

const SkeletonBase = ({
  width = '100%',
  height = 16,
  borderRadius = RADIUS.sm,
  marginTop = 0,
}: SkeletonBaseProps) => (
  <View
    style={[
      styles.base,
      {
        width,
        height,
        borderRadius,
        marginTop,
      },
    ]}
  />
);

/* -------------------------------------------------------------------------- */
/*  ✅ SkeletonFrame — 여러 Item 반복                                        */
/* -------------------------------------------------------------------------- */
type SkeletonFrameProps = {
  quantity?: number;
  children: React.ReactNode;
};

const SkeletonFrame = ({ quantity = 6, children }: SkeletonFrameProps) => (
  <View>
    {Array.from({ length: quantity }).map((_, idx) => (
      <View key={idx} style={styles.frameItem}>
        {children}
      </View>
    ))}
  </View>
);

/* -------------------------------------------------------------------------- */
/*  ✅ 프리셋: FeedSkeleton (게시물 리스트)                                  */
/* -------------------------------------------------------------------------- */
export const FeedSkeleton = () => {
  return (
    <SkeletonFrame quantity={4}>
      <View style={styles.wrapper}>
        <SkeletonItem>
          <SkeletonBase width="100%" height={160} borderRadius={RADIUS.md} />
        </SkeletonItem>
        <SkeletonItem>
          <SkeletonBase width="70%" height={16} marginTop={SPACING.sm} />
        </SkeletonItem>
        <SkeletonItem>
          <SkeletonBase width="50%" height={14} marginTop={SPACING.xs} />
        </SkeletonItem>
      </View>
    </SkeletonFrame>
  );
};

/* -------------------------------------------------------------------------- */
/*  ✅ 프리셋: ProfileSkeleton (프로필 카드)                                 */
/* -------------------------------------------------------------------------- */
export const ProfileSkeleton = () => {
  return (
    <View style={[styles.wrapper, { alignItems: 'center' }]}>
      <SkeletonItem>
        <SkeletonBase width={80} height={80} borderRadius={RADIUS.full} />
      </SkeletonItem>
      <SkeletonItem>
        <SkeletonBase width="50%" height={16} marginTop={SPACING.sm} />
      </SkeletonItem>
      <SkeletonItem>
        <SkeletonBase width="30%" height={14} marginTop={SPACING.xs} />
      </SkeletonItem>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*  ✅ 기존 예시 유지 (FolderSkeleton / NoteSkeleton)                        */
/* -------------------------------------------------------------------------- */
export const FolderSkeleton = () => (
  <SkeletonFrame quantity={6}>
    <View style={styles.wrapper}>
      <SkeletonItem>
        <SkeletonBase height={20} />
      </SkeletonItem>
    </View>
  </SkeletonFrame>
);

export const NoteSkeleton = () => {
  const ITEMS = [
    <SkeletonBase key="title" height={16} />,
    <SkeletonBase key="date" width="20%" height={12} marginTop={SPACING.xs} />,
    <SkeletonBase
      key="folder"
      width="10%"
      height={12}
      marginTop={SPACING.xs}
    />,
  ];
  return (
    <SkeletonFrame quantity={6}>
      <View style={styles.wrapper}>
        {ITEMS.map((component, idx) => (
          <SkeletonItem key={idx}>{component}</SkeletonItem>
        ))}
      </View>
    </SkeletonFrame>
  );
};

/* -------------------------------------------------------------------------- */
/*  ✅ 스타일                                                                */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  animatedItem: {
    width: '100%',
  },
  base: {
    backgroundColor: COLORS.overlay_dark ?? COLORS.overlay_dark,
    overflow: 'hidden',
  },
  frameItem: {
    marginBottom: SPACING.sm,
  },
  wrapper: {
    backgroundColor: COLORS.background,
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    flexDirection: 'column',
    gap: SPACING.xs,
  },
});

export default SkeletonItem;
