// 📄 App.tsx
import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, Platform, Keyboard, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import GlobalBottomSheet from '@/common/components/GlobalBottomSheet';
import { COLORS } from '@/common/styles/colors';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import { queryClient } from '@/services/reactQuery/reactQueryClient';
import '@/i18n';
import { AppToastContainer } from '@/common/components/AppToast/AppToastManager';
import RootNavigator from '@/navigators/RootNavigator';
import { initFCM } from '@/services/notification/fcmService';
import { startWatchingLocation, stopWatchingLocation } from '@/services/device';
import * as RNLocalize from 'react-native-localize';
import i18n from '@/i18n';

// 📌 개발용 로그
const DEV_LOG = (...args: any[]) => __DEV__ && console.log(...args);

/* 🎨 네비게이션 테마 */
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.background,
    border: COLORS.border,
    primary: COLORS.button_active,
    text: COLORS.body,
    notification: COLORS.error,
  },
};

const App = () => {
  // 🧩 시스템바 설정 (Android)
  useEffect(() => {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('transparent', false);
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('light-content');
    }
  }, []);

  // 🌍 기기 언어 확인 로그
  useEffect(() => {
    const locales = RNLocalize.getLocales();
    const deviceLanguage = locales[0];
    DEV_LOG('🌍 [언어 정보]', {
      languageCode: deviceLanguage.languageCode,
      countryCode: deviceLanguage.countryCode,
      languageTag: deviceLanguage.languageTag,
      allLocales: locales,
      currentAppLang: i18n.language,
    });
  }, []);

  // 🌍 위치 감시
  useEffect(() => {
    let watching = false;
    const initLocation = async () => {
      const { checkPermission } = await import('@/services/device/permissionService');
      const status = await checkPermission('location');
      if (status === 'granted') {
        watching = true;
        startWatchingLocation();
        DEV_LOG('✅ [App] 위치 감시 시작');
      }
    };
    initLocation();

    return () => {
      if (watching) {
        stopWatchingLocation();
        DEV_LOG('🛑 [App] 위치 감시 중단');
      }
    };
  }, []);

  // 🔔 FCM 초기화 (로그인 전 토큰만)
  useEffect(() => {
    initFCM();
  }, []);

  // ⌨️ 전역 키보드 이벤트
  useEffect(() => {
    const { setKeyboard } = useKeyboardStore.getState();
    const showSub = Keyboard.addListener('keyboardDidShow', e => setKeyboard(true, e.endCoordinates.height));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboard(false, 0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  DEV_LOG('🧭 RN Dev Mode:', __DEV__);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <NavigationContainer theme={MyTheme}>
              <BottomSheetModalProvider>
                <GlobalBottomSheet />
                <RootNavigator />
                <AppToastContainer />
              </BottomSheetModalProvider>
            </NavigationContainer>
          </SafeAreaView>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: COLORS.background },
  safeArea: { flex: 1, backgroundColor: COLORS.background },
});

export default App;
