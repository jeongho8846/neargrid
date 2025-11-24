import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/i18n';

import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';

type LanguageOption = {
  code: 'kr' | 'en';
  label: string;
  nativeLabel: string;
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'kr', label: 'Korean', nativeLabel: '한국어' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
];

const LanguageSettingScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<'kr' | 'en'>(
    i18n.language as 'kr' | 'en',
  );

  const handleLanguageChange = async (languageCode: 'kr' | 'en') => {
    try {
      await changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      console.log('✅ [Language] 언어 변경:', languageCode);
    } catch (error) {
      console.error('❌ [Language] 언어 변경 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <AppCollapsibleHeader
        titleKey="STR_LANGUAGE_SETTING"
        headerOffset={0}
        isAtTop={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* 언어 옵션 리스트 */}
      <View style={styles.content}>
        {LANGUAGE_OPTIONS.map(option => {
          const isSelected = currentLanguage === option.code;

          return (
            <TouchableOpacity
              key={option.code}
              style={styles.languageItem}
              onPress={() => handleLanguageChange(option.code)}
              activeOpacity={0.7}
            >
              <View style={styles.languageInfo}>
                <AppText
                  variant="body"
                  style={[
                    styles.nativeLabel,
                    isSelected && { color: COLORS.button_active },
                  ]}
                >
                  {option.nativeLabel}
                </AppText>
                <AppText
                  variant="body"
                  style={[
                    styles.englishLabel,
                    isSelected && { color: COLORS.button_active },
                  ]}
                >
                  {option.label}
                </AppText>
              </View>

              {/* 선택된 언어 표시 */}
              {isSelected && (
                <AppIcon
                  type="ion"
                  name="checkmark-circle"
                  size={24}
                  color={COLORS.button_active}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 안내 문구 */}
      <View style={styles.footer}>
        <AppText style={styles.footerText}>
          {t('STR_LANGUAGE_SETTING_GUIDE', '언어 변경은 즉시 적용됩니다.')}
        </AppText>
      </View>
    </View>
  );
};

export default LanguageSettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingTop: 60, // 헤더 높이만큼
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  languageInfo: {
    flex: 1,
  },
  nativeLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  englishLabel: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
