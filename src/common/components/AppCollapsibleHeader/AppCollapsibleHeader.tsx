// src/common/components/AppCollapsibleHeader/AppCollapsibleHeader.tsx
import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../AppText';
import AppIcon from '../AppIcon'; // ✅ 공용 아이콘 컴포넌트로 교체

type Props = {
  title?: string; // 직접 문자열
  titleKey?: string; // i18n key
  headerHeight?: number;
  backgroundColor?: string;
  children: React.ReactNode;
  showBack?: boolean; // ← 뒤로가기 버튼 표시 여부
  onBackPress?: () => void;
  right?: React.ReactNode; // → 우측 슬롯 (버튼, 아이콘 등)
};

const AppCollapsibleHeader: React.FC<Props> = ({
  title,
  titleKey,
  headerHeight = 56,
  backgroundColor = '#fff',
  children,
  showBack = false,
  onBackPress,
  right,
}) => {
  const insets = useSafeAreaInsets();
  const HEADER_TOTAL = headerHeight + insets.top;

  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (diff > 5 && visible) {
      setVisible(false);
      Animated.timing(translateY, {
        toValue: -HEADER_TOTAL,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (diff < -5 && !visible) {
      setVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentY;
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: HEADER_TOTAL }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {children}
      </Animated.ScrollView>

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            height: HEADER_TOTAL,
            paddingTop: insets.top,
            backgroundColor,
            transform: [{ translateY }],
          },
          Platform.select({
            ios: styles.headerShadowIOS,
            android: styles.headerShadowAndroid,
          }),
        ]}
      >
        <View style={styles.bar}>
          {/* 좌측: 뒤로가기 버튼 */}
          <View style={styles.side}>
            {showBack && (
              <TouchableOpacity
                onPress={onBackPress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AppIcon
                  type="ion"
                  name="arrow-back-sharp"
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* 중앙: 타이틀 */}
          <AppText i18nKey={titleKey} style={styles.title}>
            {title}
          </AppText>

          {/* 우측: 커스텀 버튼 */}
          <View style={styles.side}>{right}</View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerShadowIOS: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  headerShadowAndroid: { elevation: 4 },
});

export default AppCollapsibleHeader;
