import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootNavigator from './src/navigators/RootNavigator';
import { COLORS } from '@/common/styles/colors';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import './src/i18n';
import GlobalBottomSheet from '@/common/components/GlobalBottomSheet';

// ✅ 전역 QueryClient 생성
const queryClient = new QueryClient();

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
  useEffect(() => {
    try {
      changeNavigationBarColor(COLORS.background, true);

      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(COLORS.background, true);
      }
    } catch (err) {
      console.warn('⚠️ System bar color change failed', err);
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* ✅ React Query Provider를 앱 전체 감싸기 */}
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <StatusBar
              translucent={false}
              backgroundColor={COLORS.background}
              barStyle="light-content"
            />
            <NavigationContainer theme={MyTheme}>
              <RootNavigator />
            </NavigationContainer>

            {/* ✅ NavigationContainer 바깥에 두기 */}
            <GlobalBottomSheet />
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
});

export default App;
