// src/services/notification/fcmBackground.ts
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export function setBackgroundMessageHandler() {
  messaging().setBackgroundMessageHandler(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      try {
        console.log('📩 [백그라운드 메시지] 수신:', remoteMessage);

        // 예시: 로컬 알림 표시, Redux 업데이트 등
        // await saveMessageToDB(remoteMessage);
        // showLocalNotification(remoteMessage);

      } catch (err) {
        console.error('❌ [백그라운드 메시지 처리 실패]:', err);
      }
    }
  );
}
