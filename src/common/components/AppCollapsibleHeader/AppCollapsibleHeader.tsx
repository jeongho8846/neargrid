// src/common/components/AppCollapsibleHeader/AppCollapsibleHeader.tsx
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
  /** ✅ 변경: optional 로 지정 */
  headerOffset?: Animated.Value; // ← 옵셔널로 변경
  isAtTop: boolean;
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

  /** ✅ headerOffset이 안 넘어오면 기본값을 생성 */
  const offset = headerOffset ?? new Animated.Value(0);

  const HEADER_TOTAL = headerHeight;
  const hideBackButton =
    route.name === 'Feed' || route.name === 'Map' || route.name === 'Profile';

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: HEADER_TOTAL,
          backgroundColor,
          transform: [{ translateY: offset }], // ✅ 기본 offset 사용
          borderBottomWidth: !isAtTop && showBorder ? 0.5 : 0,
        },
      ]}
    >
      <View style={styles.bar}>
        {/* 왼쪽: 뒤로가기 */}
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

        {/* 오른쪽: 커스텀 */}
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
