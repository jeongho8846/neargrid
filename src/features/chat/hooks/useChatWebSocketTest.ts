import { useEffect, useRef, useState } from 'react';
import { Client, IMessage, Frame } from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStompChatClient({
  memberId,
  enabled = true,
}: {
  memberId?: string;
  enabled?: boolean;
}) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !memberId) {
      console.log('⚠️ [STOMP] Disabled or no memberId provided');
      return;
    }

    let isUnmounted = false;

    const connect = async () => {
      console.log('🚀 [INIT] useStompChatClient 시작');
      try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log('🔑 [TOKEN]', token ? `${token.slice(0, 20)}...` : '없음');

        if (!token) {
          console.warn('⚠️ [STOMP] AccessToken 없음 → 연결 중단');
          return;
        }

        const url = 'wss://api.neargrid.ai:490/chatConnect-app';
        console.log('🌐 [STOMP] 연결 시도:', url);

        const client = new Client({
          brokerURL: url,
          connectHeaders: {
            authorization: `Bearer ${token}`,
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,

          // ✅ STOMP 프레임 전체 출력
          debug: msg => {
            if (msg.startsWith('>>>')) console.log('⬆️ [STOMP SEND]', msg);
            else if (msg.startsWith('<<<')) console.log('⬇️ [STOMP RECV]', msg);
            else console.log('🪶 [STOMP DEBUG@@]', msg);
          },

          beforeConnect: () => {
            console.log('⏳ [STOMP] beforeConnect 호출됨');
          },
          onWebSocketOpen: () => {
            console.log('🔵 [STOMP] WebSocket OPEN');
          },
          onConnect: (frame: Frame) => {
            if (isUnmounted) return;
            console.log('✅ [STOMP] 연결 성공!');
            console.log('📜 [CONNECT FRAME]', frame.headers);
            setConnected(true);

            const subPath = `/private/${memberId}`;
            console.log(`📡 [SUBSCRIBE] ${subPath}`);
            client.subscribe(subPath, (message: IMessage) => {
              console.log('📨 [MESSAGE ARRIVED]');
              console.log('  • headers:', message.headers);
              try {
                console.log('  • body (parsed):', JSON.parse(message.body));
              } catch {
                console.log('  • body (raw):', message.body);
              }
            });
          },
          onStompError: frame => {
            console.error(
              '❌ [STOMP ERROR]',
              frame.headers['message'],
              frame.body,
            );
          },
          onWebSocketError: e => {
            console.error('🚨 [WebSocket ERROR]', e);
          },
          onDisconnect: frame => {
            console.log('🔌 [STOMP] Disconnected', frame || '');
            setConnected(false);
          },
          onWebSocketClose: evt => {
            console.log('⚫ [WebSocket CLOSED]', evt.code, evt.reason);
          },
        });

        console.log('⚙️ [STOMP] 클라이언트 활성화');
        client.activate();
        clientRef.current = client;
      } catch (err) {
        console.error('🔥 [STOMP INIT ERROR]', err);
      }
    };

    connect();

    return () => {
      isUnmounted = true;
      if (clientRef.current) {
        console.log('🧹 [CLEANUP] STOMP 종료 시도');
        try {
          clientRef.current.deactivate();
          console.log('🧹 [CLEANUP] 성공적으로 비활성화됨');
        } catch (err) {
          console.error('🧹 [CLEANUP ERROR]', err);
        }
      }
    };
  }, [enabled, memberId]);

  const sendMessage = (destination: string, payload: any) => {
    const client = clientRef.current;
    if (!client || !connected) {
      console.warn('⚠️ [STOMP] 연결되지 않음 → 메시지 전송 불가');
      return;
    }

    try {
      const body = JSON.stringify(payload);
      console.log('📤 [SEND MESSAGE]', destination, body);
      client.publish({ destination, body });
    } catch (err) {
      console.error('❌ [SEND ERROR]', err);
    }
  };

  return { connected, sendMessage };
}
