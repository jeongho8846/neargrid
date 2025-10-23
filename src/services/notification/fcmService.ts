// src/services/notification/fcmService.ts
import messaging from '@react-native-firebase/messaging';
import { registerFcmToken } from './fcmTokenApi';
import { AppState } from 'react-native';

let cachedToken: string | null = null;

export async function initFCM(currentMemberId?: string) {
  try {
    // ✅ 권한 요청 (Android/iOS 공통)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('🔕 FCM 권한 거부됨');
      return;
    }

    // ✅ 토큰 발급
    const token = await messaging().getToken();
    cachedToken = token;
    console.log('📡 [FCM] Token:', token);

    // ✅ 로그인 되어 있으면 서버로 전송
    if (token && currentMemberId) {
      await registerFcmToken(currentMemberId, token);
    }

    // ✅ 토큰 갱신 시
    messaging().onTokenRefresh(async newToken => {
      cachedToken = newToken;
      console.log('🔄 [FCM] Token 갱신:', newToken);
      if (currentMemberId) {
        await registerFcmToken(currentMemberId, newToken);
      }
    });

    // ✅ 백그라운드 핸들러 (옛날 notificationHandler.ts 역할)
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📩 [백그라운드 메시지 수신]:', remoteMessage);
    });

    // ✅ 포그라운드 메시지 수신
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('💬 [포그라운드 메시지 수신]:', remoteMessage);
    });

    // ✅ 앱 상태 변경 감지 (포그라운드 복귀 시 토큰 확인)
    AppState.addEventListener('change', async state => {
      if (state === 'active') {
        const refreshed = await messaging().getToken();
        if (refreshed && refreshed !== cachedToken) {
          cachedToken = refreshed;
          console.log('🔁 [FCM] 토큰 갱신 감지:', refreshed);
          if (currentMemberId) {
            await registerFcmToken(currentMemberId, refreshed);
          }
        }
      }
    });

    return unsubscribe;
  } catch (err) {
    console.error('❌ [FCM] 초기화 실패:', err);
  }
}

export function getCachedFcmToken() {
  return cachedToken;
}
