import messaging from '@react-native-firebase/messaging';

export function setBackgroundMessageHandler() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('📩 백그라운드 메시지:', remoteMessage);
    // TODO: 백그라운드 알림 처리 로직
  });
}
