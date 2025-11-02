// 📄 App.tsx
import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, Platform, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import RootNavigator from '@/navigators/RootNavigator';
import GlobalBottomSheet from '@/common/components/GlobalBottomSheet';
import GlobalInputBar from '@/common/components/GlobalInputBar/GlobalInputBar';
import { COLORS } from '@/common/styles/colors';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import { queryClient } from '@/services/reactQuery/reactQueryClient';
import '@/i18n';

/* 🎨 네비게이션 테마 */
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.background,
    border: COLORS.border,
    primary: COLORS.button_active,
    text: COLORS.text,
    notification: COLORS.error,
  },
};

const App = () => {
  /* 🧩 시스템바 및 FCM 초기화 */
  useEffect(() => {
    try {
      changeNavigationBarColor(COLORS.background, true);

      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(COLORS.background, true);
      }

      // Firebase 초기화 후 FCM 시작
      const timer = setTimeout(() => {
        // initFCM();
      }, 800);

      return () => clearTimeout(timer);
    } catch (err) {
      console.warn('⚠️ System bar or FCM init failed', err);
    }
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <StatusBar
              translucent={false}
              backgroundColor="transparent"
              barStyle="light-content"
            />
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
              <NavigationContainer theme={MyTheme}>
                <RootNavigator />

                {/* ✅ Navigation Context 안쪽으로 이동 */}
                <GlobalBottomSheet />
                <GlobalInputBar />
              </NavigationContainer>
            </SafeAreaView>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
