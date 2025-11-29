// src/services/notification/fcmService.ts
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { registerFcmToken } from './fcmTokenApi';
import { AppState } from 'react-native';

let cachedToken: string | null = null;

/**
 * cachedToken 초기화
 */
export function resetCachedFcmToken() {
  cachedToken = null;
  console.log('🗑️ [FCM] cachedToken 초기화 완료');
}

/**
 * FCM 초기화
 * @param currentMemberId 로그인된 회원 ID (optional)
 * @returns 포그라운드 메시지 구독 해제 함수
 */
export async function initFCM(
  currentMemberId?: string
): Promise<(() => void) | undefined> {
  console.log('🔥 initFCM 실행');

  try {
    // 1️⃣ 권한 요청
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('🔕 FCM 권한 거부됨');
      return;
    }

    // 2️⃣ 토큰 발급
    const token = await messaging().getToken();
    cachedToken = token;
    console.log('📡 [FCM] Token:', token);

    if (token && currentMemberId) {
      await registerFcmToken(currentMemberId, token).catch(console.error);
    }

    // 3️⃣ 토큰 갱신 처리
    messaging().onTokenRefresh(newToken => {
      cachedToken = newToken;
      console.log('🔄 [FCM] Token 갱신:', newToken);

      if (currentMemberId) {
        registerFcmToken(currentMemberId, newToken).catch(console.error);
      }
    });

    // 4️⃣ 백그라운드 메시지 처리 (iOS/Android 공통)
    messaging().setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('📩 [백그라운드 메시지]:', remoteMessage);
      }
    );

    // 5️⃣ 포그라운드 메시지 처리
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('💬 [포그라운드 메시지]:', remoteMessage);
      }
    );

    // 6️⃣ 앱 활성화 시 토큰 갱신 체크
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        (async () => {
          try {
            const refreshed = await messaging().getToken();
            if (refreshed && refreshed !== cachedToken) {
              cachedToken = refreshed;
              console.log('🔁 [FCM] 토큰 갱신 감지:', refreshed);

              if (currentMemberId) {
                await registerFcmToken(currentMemberId, refreshed).catch(
                  console.error
                );
              }
            }
          } catch (err) {
            console.error('❌ [FCM] AppState 토큰 갱신 실패:', err);
          }
        })();
      }
    });

    return unsubscribeOnMessage;
  } catch (err) {
    console.error('❌ [FCM] 초기화 실패:', err);
  }
}

/**
 * 현재 캐시된 FCM 토큰 반환
 */
export function getCachedFcmToken(): string | null {
  return cachedToken;
}
