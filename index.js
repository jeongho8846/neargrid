import 'react-native-reanimated'; // 맨 위
import 'react-native-gesture-handler';
// import './src/setup/globalPolyfill'; // ✅ 반드시 최상단에 넣기

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { APP_ENV, MEMBER_API_BASE_URL } from '@env';

console.log('🚀 App Environment:', APP_ENV);
console.log('🔗 MEMBER_API_BASE_URL:', MEMBER_API_BASE_URL);

AppRegistry.registerComponent(appName, () => App);
