import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppCollapsibleHeader from '../../common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '../../common/components/AppText';
import AppIcon from '../../common/components/AppIcon';
import { tokenStorage } from '@/features/member/utils/tokenStorage';
import { decodeJwt } from '@/utils/jwt';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

const MapScreen = () => {
  const navigation = useNavigation();
  const [expiryText, setExpiryText] = useState<string>('');

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
    <AppCollapsibleHeader
      titleKey="STR_MAP"
      showBack
      onBackPress={() => navigation.goBack()}
      right={
        <TouchableOpacity onPress={() => console.log('검색')}>
          <AppIcon type="ion" name="search" size={22} color={COLORS.text} />
        </TouchableOpacity>
      }
    >
      <View style={styles.content}>
        <AppText i18nKey="STR_MAP_CONTENT" style={styles.text} />
        <AppText>{expiryText}</AppText>
        <View style={styles.mockBlock}>
          <AppText i18nKey="STR_TEST_SCROLL_CONTENT" />
        </View>
      </View>
    </AppCollapsibleHeader>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  text: {
    ...FONT.title, // ✅ 제목 스타일 적용
  },
  mockBlock: {
    height: 10000,
    backgroundColor: COLORS.background, // ✅ 임시 블록 배경
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
