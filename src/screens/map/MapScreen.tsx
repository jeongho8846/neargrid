import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { tokenStorage } from '@/features/member/utils/tokenStorage';
import { decodeJwt } from '@/utils/jwt';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

const MapScreen = () => {
  const navigation = useNavigation();
  const [expiryText, setExpiryText] = useState<string>('');
  const { open, close } = useBottomSheetStore();

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastY = useRef(0);
  const [forceShow, setForceShow] = useState(true);

  // ✅ 스크롤 방향 감지
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    const diff = currentY - lastY.current;

    if (diff < -5) {
      setForceShow(true); // 스크롤 위로 → 헤더 보이기
    } else if (diff > 5) {
      setForceShow(false); // 스크롤 아래로 → 헤더 숨기기
    }

    lastY.current = currentY;
  };

  useEffect(() => {
    const checkExpiry = async () => {
      const { refreshToken } = await tokenStorage.getTokens();
      if (!refreshToken) {
        setExpiryText('❌ refreshToken 없음');
        return;
      }
      const payload = decodeJwt(refreshToken);
      if (!payload?.exp) {
        setExpiryText('❌ exp 없음');
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const remain = payload.exp - now;

      if (remain <= 0) {
        setExpiryText('❌ 이미 만료됨');
      } else {
        const hours = Math.floor(remain / 3600);
        const minutes = Math.floor((remain % 3600) / 60);
        const seconds = remain % 60;
        setExpiryText(
          `⏳ 만료까지 ${hours}시간 ${minutes}분 ${seconds}초 남음`,
        );
      }
    };

    checkExpiry();
  }, []);

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_MAP"
        scrollY={scrollY}
        forceShow={forceShow}
        onBackPress={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => console.log('검색')}>
            <AppIcon type="ion" name="search" size={22} color={COLORS.text} />
          </TouchableOpacity>
        }
      />

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 100 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true, listener: handleScroll },
        )}
      >
        <View style={styles.content}>
          <AppText i18nKey="STR_MAP_CONTENT" style={styles.text} />
          <AppText>{expiryText}</AppText>

          <View style={styles.mockBlock}>
            <AppText i18nKey="STR_TEST_SCROLL_CONTENT" />
          </View>

          <Button
            title="전역 바텀시트 열기"
            onPress={() =>
              open(
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                  }}
                >
                  <AppText>📝 전역 바텀시트 내용</AppText>
                  <Button title="닫기" onPress={close} />
                </View>,
                ['25%', '50%'],
              )
            }
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  text: {
    ...FONT.title,
  },
  mockBlock: {
    height: 3000,
    backgroundColor: COLORS.background,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
