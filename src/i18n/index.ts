// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import * as RNLocalize from 'react-native-localize'; // ⚠️ 지금은 쓰이지 않음
import kr from './language_kr.json';
// import en from "./language_en.json"; // 나중에 추가

const resources = {
  kr: { translation: kr },
  // en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'kr', // ✅ 한국어 고정
  fallbackLng: 'kr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
