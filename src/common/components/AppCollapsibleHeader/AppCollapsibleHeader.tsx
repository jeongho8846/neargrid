// 📄 src/common/components/AppCollapsibleHeader/AppCollapsibleHeader.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import AppText from '../AppText';
import AppIcon from '../AppIcon';
import { COLORS } from '@/common/styles/colors';

type Props = {
  title?: string;
  titleKey?: string;
  headerHeight?: number;
  backgroundColor?: string;
  onBackPress?: () => void;
  right?: React.ReactNode;
  showBorder?: boolean;
};

const AppCollapsibleHeader: React.FC<Props> = ({
  title,
  titleKey,
  headerHeight = 56,
  backgroundColor = COLORS.background,
  onBackPress,
  right,
  showBorder = true,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();

  const HEADER_TOTAL = headerHeight;
  const hideBackButton =
    route.name === 'Feed' || route.name === 'Map' || route.name === 'Profile';

  const showBackButton = !hideBackButton && canGoBack;

  return (
    <View
      style={[
        styles.header,
        {
          height: HEADER_TOTAL,
          backgroundColor,
          borderBottomWidth: showBorder ? 0.5 : 0,
        },
      ]}
    >
      <View style={styles.bar}>
        {/* 🔙 왼쪽: 뒤로가기 */}
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
                variant="primary"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* 🏷️ 중앙(또는 왼쪽): 타이틀 */}
        <AppText
          i18nKey={titleKey}
          variant="title"
          style={showBackButton ? styles.titleLeft : styles.titleCenter}
        >
          {title}
        </AppText>

        {/* ⚙️ 오른쪽: 커스텀 영역 */}
        <View style={styles.side}>{right}</View>
      </View>
    </View>
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
  },
  side: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCenter: {
    flex: 1,
    textAlign: 'center',
  },
  titleLeft: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 4,
  },
});
