// 📄 App.tsx
import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, Platform, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import GlobalBottomSheet from '@/common/components/GlobalBottomSheet';
import GlobalInputBar from '@/common/components/GlobalInputBar/GlobalInputBar';
import { COLORS } from '@/common/styles/colors';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import { queryClient } from '@/services/reactQuery/reactQueryClient';
import '@/i18n';
import { AppToastContainer } from '@/common/components/AppToast/AppToastManager';
import RootNavigator from '@/navigators/RootNavigator';
import messaging from '@react-native-firebase/messaging';
import { initFCM } from '@/services/notification/fcmService';
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
  /* 🧩 시스템바 및 FCM 초기화 */
  useEffect(() => {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('transparent', false);
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('light-content');
    }
  }, []);

  useEffect(() => {
    initFCM(); // 로그인 전 → 토큰만 생성해서 cachedToken 저장
  }, []);

  /* ⌨️ 전역 키보드 상태 감지 */
  useEffect(() => {
    const { setKeyboard } = useKeyboardStore.getState();

    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboard(true, e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboard(false, 0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  /* ✅ 구조 설명:
     GestureHandlerRootView —> SafeAreaProvider —> QueryClientProvider
       —> BottomSheetModalProvider —> SafeAreaView —> NavigationContainer
         ├─ RootNavigator
         ├─ GlobalBottomSheet (navigation context 공유)
         └─ GlobalInputBar
  */
  console.log('🧭 RN Dev Mode:', __DEV__);
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* ✅ NavigationContext보다 위에 있던 Provider를 아래로 이동 */}
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <NavigationContainer theme={MyTheme}>
              {/* ✅ 이제 NavigationContext 내부에서 동작함 */}
              <BottomSheetModalProvider>
                {/* <GlobalInputBar /> */}
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
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
