import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigators/RootNavigator';
import './src/i18n'; // ✅ i18n 초기화

const App = () => {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
};

export default App;
