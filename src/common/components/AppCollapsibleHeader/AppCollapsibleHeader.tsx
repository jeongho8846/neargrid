import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import AppText from '../AppText';
import AppIcon from '../AppIcon';

type Props = {
  title?: string;
  titleKey?: string;
  headerHeight?: number;
  backgroundColor?: string;
  children: React.ReactNode;
  onBackPress?: () => void;
  right?: React.ReactNode;
};

const AppCollapsibleHeader: React.FC<Props> = ({
  title,
  titleKey,
  headerHeight = 56,
  backgroundColor = '#fff',
  children,
  onBackPress,
  right,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  const HEADER_TOTAL = headerHeight + insets.top;

  // 스크롤 값
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastY = useRef(0);
  const [forceShow, setForceShow] = useState(false);

  // ⬇️ 기본 동작: 스크롤 위치에 따라 위로 사라짐
  const autoTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_TOTAL],
    outputRange: [0, -HEADER_TOTAL],
    extrapolate: 'clamp',
  });

  // 최종 헤더 위치 = 강제 보임 or 자동
  const translateY = forceShow ? 0 : autoTranslateY;

  // 스크롤 방향 감지
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    const diff = currentY - lastY.current;

    if (diff < -5) {
      // ⬆️ 위로 조금만 올려도 → 헤더 강제 보이기
      if (!forceShow) setForceShow(true);
    } else if (diff > 5) {
      // ⬇️ 내릴 때 → 자동 interpolate 모드
      if (forceShow) setForceShow(false);
    }

    lastY.current = currentY;
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: HEADER_TOTAL }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true, listener: handleScroll },
        )}
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
          {/* 좌측: 뒤로가기 */}
          <View style={styles.side}>
            {canGoBack && (
              <TouchableOpacity
                onPress={onBackPress || (() => navigation.goBack())}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AppIcon type="ion" name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          {/* 중앙: 타이틀 */}
          <AppText i18nKey={titleKey} style={styles.title}>
            {title}
          </AppText>

          {/* 우측: 액션 */}
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
