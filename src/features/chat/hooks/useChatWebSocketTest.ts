import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs'; // ✅ RN 호환 import
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * ✅ useChatWebSocketSockJS
 * - React Native + SockJS 1.1.2 호환 버전
 * - STOMP.js 7.x 기반
 */
export function useChatWebSocketSockJS(enabled: boolean = true) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let isUnmounted = false;

    const connect = async () => {
      const token = await AsyncStorage.getItem('accessToken');

      console.log('🚀 [INIT] useChatWebSocketSockJS 시작');

      const baseUrl = 'https://api.neargrid.ai:490/chatConnect'; // ✅ SockJS는 https로 시작해야 함
      const masked =
        token && token.length > 10
          ? `${token.slice(0, 10)}...${token.slice(-5)}`
          : token;
      console.log('🔑 [TOKEN]', masked ?? '(없음)');

      // ✅ SockJS 인스턴스 생성 (RN에서는 transports 제한 필수)
      const sock = new SockJS(baseUrl, null, { transports: ['websocket'] });

      // ✅ STOMP 클라이언트 생성 시 connectHeaders 바로 주입
      const client = new Client({
        webSocketFactory: () => sock,

        // ✅ 연결 시 Authorization 헤더 포함
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        // ✅ 디버그 로그
        debug: msg => {
          if (msg.includes('Opening Web Socket')) {
            console.log('🔵 [DEBUG] WebSocket 열기');
          } else if (msg.includes('Web Socket Opened')) {
            console.log('🟢 [DEBUG] WebSocket 연결 성공');
          } else if (msg.includes('Connection not established')) {
            console.warn('⏰ [DEBUG] STOMP 연결 타임아웃');
          } else {
            console.log('[STOMP]', msg);
          }
        },

        beforeConnect: () => {
          console.log('⏳ [STOMP] beforeConnect 호출됨');
          if (!token) throw new Error('⚠️ AccessToken 없음');
          console.log('📤 [STOMP] CONNECT 헤더 주입 완료');
        },

        onConnect: frame => {
          if (isUnmounted) return;
          console.log('✅ [STOMP] 연결 성공', frame.headers);
          setConnected(true);

          // ✅ 테스트 구독
          client.subscribe('/topic/test', (msg: IMessage) => {
            console.log('📩 [MESSAGE 수신]', msg.body);
          });

          // ✅ 테스트 발행
          client.publish({
            destination: '/topic/test',
            body: JSON.stringify({ msg: 'Hello from nearGrid SockJS!' }),
          });
        },

        onDisconnect: () => {
          console.log('🛑 [STOMP] 연결 종료');
          if (!isUnmounted) setConnected(false);
        },

        onStompError: frame => {
          console.error('❌ [STOMP ERROR]', frame.headers['message']);
          console.error('📩 [STOMP ERROR BODY]', frame.body);
        },

        onWebSocketClose: e => {
          console.warn('🔻 [WS CLOSED]', e.code, e.reason);
        },

        onWebSocketError: e => {
          console.error('⚠️ [WS ERROR]', e.message);
        },
      });

      console.log('⚙️ [STOMP] 활성화 시작');
      client.activate();
      clientRef.current = client;
    };

    connect();

    // 🧹 cleanup
    return () => {
      isUnmounted = true;
      if (clientRef.current) {
        console.log('🧹 [CLEANUP] SockJS 연결 종료');
        clientRef.current.deactivate();
      }
    };
  }, [enabled]);

  return { connected };
}
