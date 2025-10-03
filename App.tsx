import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import RootNavigator from './src/navigators/RootNavigator';
import { COLORS } from '@/common/styles/colors';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import './src/i18n';
import GlobalBottomSheet from '@/common/components/GlobalBottomSheet';

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
      // 하단 소프트키 영역
      changeNavigationBarColor(COLORS.background, true);

      // ✅ 상단 StatusBar 색상 강제 적용 (안드로이드)
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false); // 겹침 방지
        StatusBar.setBackgroundColor(COLORS.background, true); // 불투명 칠하기
      }
    } catch (err) {
      console.warn('⚠️ System bar color change failed', err);
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: COLORS.background }}>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
});

export default App;
