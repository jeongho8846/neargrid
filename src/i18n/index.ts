// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import kr from './language_kr.json';
import en from './language_en.json';

const resources = {
  kr: { translation: kr },
  en: { translation: en },
};

/**
 * 기기의 기본 언어 가져오기
 * @returns 'kr' | 'en'
 */
const getDeviceLanguage = (): 'kr' | 'en' => {
  const locales = RNLocalize.getLocales();

  if (locales.length > 0) {
    const deviceLang = locales[0].languageCode;
    console.log('🌍 [i18n] 기기 언어:', deviceLang);

    // 한국어면 'kr', 그 외는 'en'
    return deviceLang === 'ko' ? 'kr' : 'en';
  }

  return 'en'; // 기본값
};

/**
 * 저장된 언어 또는 기기 언어 가져오기
 */
const getInitialLanguage = async (): Promise<'kr' | 'en'> => {
  try {
    // 1. AsyncStorage에서 저장된 언어 확인
    const savedLanguage = await AsyncStorage.getItem('app-language');

    if (savedLanguage === 'kr' || savedLanguage === 'en') {
      console.log('🌍 [i18n] 저장된 언어 사용:', savedLanguage);
      return savedLanguage;
    }

    // 2. 저장된 언어가 없으면 기기 언어 사용
    const deviceLanguage = getDeviceLanguage();
    console.log('🌍 [i18n] 기기 언어로 초기화:', deviceLanguage);

    // 3. 기기 언어를 저장
    await AsyncStorage.setItem('app-language', deviceLanguage);

    return deviceLanguage;
  } catch (error) {
    console.error('❌ [i18n] 언어 설정 로드 실패:', error);
    return 'en'; // 에러 시 기본값
  }
};

// ✅ 비동기 초기화
const initializeI18n = async () => {
  const initialLanguage = await getInitialLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage, // ✅ 저장된 언어 또는 기기 언어
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

  console.log('✅ [i18n] 초기화 완료. 현재 언어:', i18n.language);
};

// ✅ 초기화 실행
initializeI18n();

/**
 * 언어 변경 및 저장
 * @param language 'kr' | 'en'
 */
export const changeLanguage = async (language: 'kr' | 'en') => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem('app-language', language);
    console.log('✅ [i18n] 언어 변경 완료:', language);
  } catch (error) {
    console.error('❌ [i18n] 언어 변경 실패:', error);
  }
};

export default i18n;
