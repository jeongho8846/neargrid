declare module 'react-native-localize' {
  export function findBestAvailableLanguage(
    languageTags: string[],
  ): { languageTag: string; isRTL: boolean } | undefined;
}
