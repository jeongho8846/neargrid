// src/services/notification/fcmService.ts
import messaging from '@react-native-firebase/messaging';
import { registerFcmToken } from './fcmTokenApi';
import { AppState } from 'react-native';

let cachedToken: string | null = null;

export function resetCachedFcmToken() {
  cachedToken = null;
  console.log('🗑️ [FCM] cachedToken 초기화 완료');
}

export async function initFCM(currentMemberId?: string) {
  console.log('🔥 initFCM 실행');

  try {
    // 권한 요청
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('🔕 FCM 권한 거부됨');
      return;
    }

    // 토큰 발급
    const token = await messaging().getToken();
    cachedToken = token;
    console.log('📡 [FCM] Token:', token);

    // 로그인 된 상태면 서버로 전송
    if (token && currentMemberId) {
      await registerFcmToken(currentMemberId, token);
    }

    // 토큰 갱신
    messaging().onTokenRefresh(async newToken => {
      cachedToken = newToken;
      console.log('🔄 [FCM] Token 갱신:', newToken);
      if (currentMemberId) {
        await registerFcmToken(currentMemberId, newToken);
      }
    });

    // 백그라운드 메시지
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📩 [백그라운드 메시지]:', remoteMessage);
    });

    // 포그라운드 메시지
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('💬 [포그라운드 메시지]:', remoteMessage);
    });

    // 포그라운드 복귀 시 토큰 체크
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
