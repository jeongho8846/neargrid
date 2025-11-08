import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/reactQuery/queryClient';
import AppNavigation from './providers/navigation';
import { COLORS } from '@/common/styles/tokens/colors';
import { StyleSheet } from 'react-native';
import AppToast from '@/common/components/AppToast';
import '@/i18n'; // ✅ 반드시 import (초기화만으로도 충분)

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppNavigation />
          <AppToast />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
