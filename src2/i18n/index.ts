import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import ko from './locales/ko.json';
import en from './locales/en.json';
import { TranslationResources } from './types';

const resources: TranslationResources = {
  ko: { translation: ko },
  en: { translation: en },
};

// 타입 에러 방지용 안전 캐스팅
const locales = (RNLocalize as any).getLocales?.() ?? [];
const systemLang = locales[0]?.languageCode || 'ko';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4', // ✅ 최신버전용
  resources,
  lng: systemLang,
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});

export default i18n;
