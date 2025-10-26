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
  headerOffset?: Animated.Value;
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

  const offset = headerOffset ?? new Animated.Value(0);

  const HEADER_TOTAL = headerHeight;
  const hideBackButton =
    route.name === 'Feed' || route.name === 'Map' || route.name === 'Profile';

  const showBackButton = !hideBackButton && canGoBack;

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: HEADER_TOTAL,
          backgroundColor,
          transform: [{ translateY: offset }],
          borderBottomWidth: !isAtTop && showBorder ? 0.5 : 0,
        },
      ]}
    >
      <View style={styles.bar}>
        {/* 왼쪽: 뒤로가기 */}
        <View style={styles.side}>
          {showBackButton && (
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

        {/* 중앙(또는 왼쪽): 타이틀 */}
        <AppText
          i18nKey={titleKey}
          style={[
            styles.title,
            showBackButton ? styles.titleLeft : styles.titleCenter,
          ]}
        >
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
    paddingHorizontal: 0,
  },
  side: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    ...FONT.title,
  },
  titleCenter: {
    textAlign: 'center',
  },
  titleLeft: {
    textAlign: 'left',
    marginLeft: 4, // 버튼과 간격
  },
});
