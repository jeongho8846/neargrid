import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, Platform, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import RootNavigator from './src/navigators/RootNavigator';
import GlobalBottomSheet from '@/common/components/GlobalBottomSheet';
import GlobalInputBar from '@/common/components/GlobalInputBar/GlobalInputBar';
import { COLORS } from '@/common/styles/colors';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import { queryClient } from '@/services/reactQuery/reactQueryClient'; // ✅ 전역 클라이언트 import
import './src/i18n';

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
  // ✅ 시스템 바, FCM 초기화
  useEffect(() => {
    try {
      changeNavigationBarColor(COLORS.background, true);

      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(COLORS.background, true);
      }

      // Firebase 네이티브 초기화 완료 후 FCM 시작
      const timer = setTimeout(() => {
        // initFCM();
      }, 800);

      return () => clearTimeout(timer);
    } catch (err) {
      console.warn('⚠️ System bar or FCM init failed', err);
    }
  }, []);

  // ✅ 전역 키보드 감지 → store 업데이트
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
              <StatusBar
                translucent={false}
                backgroundColor={COLORS.background}
                barStyle="light-content"
              />

              {/* ✅ 네비게이션 */}
              <NavigationContainer theme={MyTheme}>
                <RootNavigator />
              </NavigationContainer>

              {/* ✅ 전역 바텀시트 */}
              <GlobalBottomSheet />

              {/* ✅ 전역 인풋바 */}
              <GlobalInputBar />
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
