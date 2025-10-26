import React from 'react';
import { Animated, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

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
  headerOffset: Animated.Value; // ✅ 스크롤 delta 기반 오프셋 전달
  isAtTop: boolean; // ✅ 최상단 여부
  showBorder?: boolean;
};

const AppCollapsibleHeader: React.FC<Props> = ({
  title,
  titleKey,
  headerHeight = 56,
  backgroundColor = COLORS.background,
  onBackPress,
  right,
  headerOffset,
  isAtTop,
  showBorder = true,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();

  const HEADER_TOTAL = headerHeight; // ✅ insets.top 제거

  // ✅ 특정 스택의 루트 스크린에서는 강제 숨김
  const hideBackButton =
    route.name === 'Feed' || route.name === 'Map' || route.name === 'Profile';

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: HEADER_TOTAL, // ✅ safe area 제외
          paddingTop: 0, // ✅ 제거
          backgroundColor,
          transform: [{ translateY: headerOffset }],
          borderBottomWidth: !isAtTop && showBorder ? 0.5 : 0,
        },
      ]}
    >
      <View style={styles.bar}>
        {/* 좌측: 뒤로가기 */}
        <View style={styles.side}>
          {!hideBackButton && canGoBack && (
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

// ✅ 스타일은 맨 아래
const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
