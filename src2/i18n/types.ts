// 📄 src2/i18n/types.ts
export type Locale = 'ko' | 'en';

export type TranslationResources = {
  [key in Locale]: {
    translation: Record<string, any>;
  };
};
