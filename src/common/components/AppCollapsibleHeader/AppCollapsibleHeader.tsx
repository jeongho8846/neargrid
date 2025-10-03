// src/common/components/AppCollapsibleHeader/AppCollapsibleHeader.tsx
import React from 'react';
import { Animated, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import AppText from '../AppText';
import AppIcon from '../AppIcon';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

type Props = {
  title?: string;
  titleKey?: string;
  headerHeight?: number;
  backgroundColor?: string;
  onBackPress?: () => void;
  right?: React.ReactNode;
  scrollY: Animated.Value;
  forceShow: boolean; // ✅ 스크롤 방향에 따라 상태 전달
};

const AppCollapsibleHeader: React.FC<Props> = ({
  title,
  titleKey,
  headerHeight = 56,
  backgroundColor = COLORS.background,
  onBackPress,
  right,
  scrollY,
  forceShow,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  const HEADER_TOTAL = headerHeight + insets.top;

  // 자동 이동값
  const autoTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_TOTAL],
    outputRange: [0, -HEADER_TOTAL],
    extrapolate: 'clamp',
  });

  const translateY = forceShow ? 0 : autoTranslateY;

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: HEADER_TOTAL,
          paddingTop: insets.top,
          backgroundColor,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.bar}>
        {/* 좌측: 뒤로가기 */}
        <View style={styles.side}>
          {canGoBack && (
            <TouchableOpacity
              onPress={onBackPress || (() => navigation.goBack())}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppIcon
                type="ion"
                name="arrow-back"
                size={24}
                color={COLORS.text}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* 중앙: 타이틀 */}
        <AppText i18nKey={titleKey} style={styles.title}>
          {title}
        </AppText>

        {/* 우측 */}
        <View style={styles.side}>{right}</View>
      </View>
    </Animated.View>
  );
};

export default AppCollapsibleHeader;

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  side: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...FONT.title,
  },
});
