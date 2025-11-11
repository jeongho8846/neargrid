// 📄 src/common/components/AppCollapsibleHeader/AppCollapsibleHeader.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, { AnimatedStyleProp } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';

import AppText from '../AppText';
import AppIcon from '../AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles';

type Props = {
  title?: string;
  titleKey?: string;
  headerHeight?: number;
  backgroundColor?: string;
  onBackPress?: () => void;
  right?: React.ReactNode;
  showBorder?: boolean;
  animatedStyle?: AnimatedStyleProp<any>;
};

const AppCollapsibleHeader: React.FC<Props> = ({
  title,
  titleKey,
  headerHeight = 56,
  backgroundColor = COLORS.background,
  onBackPress,
  right,
  showBorder = true,
  animatedStyle,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();

  // ✅ 루트 스크린에서는 화살표 숨김
  const hideBackButton =
    route.name === 'Feed' || route.name === 'Map' || route.name === 'Profile';
  const showBackButton = !hideBackButton && canGoBack;

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          backgroundColor,
          borderBottomWidth: showBorder ? StyleSheet.hairlineWidth : 0,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.bar}>
        {/* 🔙 좌측 */}
        {showBackButton && (
          <View style={styles.left}>
            <TouchableOpacity
              onPress={onBackPress || (() => navigation.goBack())}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppIcon
                type="ion"
                name="arrow-back"
                size={24}
                variant="primary"
              />
            </TouchableOpacity>
          </View>
        )}

        {/* 🏷️ 중앙 (항상 시각적으로 정확한 중앙) */}
        <View style={styles.centerContainer} pointerEvents="none">
          <AppText
            i18nKey={titleKey}
            variant="title"
            numberOfLines={1}
            style={styles.title}
          >
            {title}
          </AppText>
        </View>

        {/* ⚙️ 우측 */}
        <View style={styles.right}>{right}</View>
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
    paddingHorizontal: SPACING.sm,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: SPACING.sm,
  },
  left: {
    position: 'absolute',
    left: SPACING.sm,
    height: '100%',
    justifyContent: 'center',
  },
  right: {
    position: 'absolute',
    right: SPACING.sm,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  centerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
