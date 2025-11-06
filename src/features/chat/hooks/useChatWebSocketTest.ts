import { useEffect, useRef, useState } from 'react';
import { Client, IMessage, IFrame } from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* -----------------------------
   🧩 테스트용 임시 모델 정의
----------------------------- */
export type ChatMessageModel = {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export type MemberChatRoomModel = {
  id: string;
  name: string;
  lastMessage?: string;
  unreadCount?: number;
  updatedAt?: string;
};

export type AlarmModel = {
  id: string;
  type: 'CHAT' | 'DONATION' | 'SYSTEM';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

/* -----------------------------
   ✅ WebSocket + STOMP 훅 본체 (수정됨)
----------------------------- */
export function useChatWebSocket(memberId?: string, enabled: boolean = true) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      console.warn('🚫 [useChatWebSocket] disabled 상태로 초기화 중단됨');
      return;
    }

    let isUnmounted = false;
    console.group('🚀 useChatWebSocket - Mount');
    console.log('👤 [MemberID]:', memberId ?? '(없음)');

    const connect = async () => {
      console.log('⚙️ [1] AsyncStorage에서 accessToken 조회 시작');
      const raw = await AsyncStorage.getItem('accessToken');
      const token = raw?.trim(); // ✅ 개행/공백 제거
      if (!token) {
        console.warn('⚠️ [1.1] accessToken 없음 — STOMP 연결 중단');
        console.groupEnd();
        return;
      }

      const wsUrl = 'wss://api.neargrid.ai:490/chatConnect-app';

      console.log('🌐 [2] 연결 준비 완료');
      console.log('   ├─ URL:', wsUrl);
      console.log('   ├─ Token:', token.slice(0, 25) + '...');
      console.log('   ├─ Enabled:', enabled);
      console.log('   └─ MemberID:', memberId);

      const client = new Client({
        // ======================================================
        // ✅ [수정됨] webSocketFactory
        // stompjs가 이벤트 리스너를 직접 관리하도록
        // 순수 WebSocket 객체만 생성하여 반환합니다.
        webSocketFactory: () => {
          console.log('🪶 WebSocket 생성 시작');
          return new WebSocket('wss://api.neargrid.ai:490/chatConnect-app');
        },
        // ======================================================

        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },

        forceBinaryWSFrames: false,
        appendMissingNULLonIncoming: true,
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        // beforeConnect는 connectHeaders가 있으므로 주석 처리 유지
        // beforeConnect: () => {
        //   console.log('⚙️ [4] beforeConnect 호출됨 — CONNECT 헤더 구성 중');
        //   client.connectHeaders = {
        //     Authorization: `Bearer ${token}`,
        //   };
        //   console.log('   ✅ CONNECT 헤더 주입 완료:', client.connectHeaders);
        // },

        onConnect: (frame: IFrame) => {
          if (isUnmounted) return;
          console.group('✅ [5] STOMP CONNECTED');
          console.log('   • session:', frame.headers['session']);
          console.log('   • server:', frame.headers['server']);
          console.log('   • heart-beat:', frame.headers['heart-beat']);
          console.log('   • memberId:', memberId);
          console.groupEnd();
          setConnected(true);
        },

        onDisconnect: () => {
          if (isUnmounted) return;
          console.warn('⚠️ [6] STOMP DISCONNECTED');
          setConnected(false);
        },

        onStompError: (frame: IFrame) => {
          console.error('❌ [7] STOMP ERROR');
          console.log('   • message:', frame.headers['message']);
          console.log('   • body:', frame.body);
        },

        onWebSocketError: error => {
          console.error('🚨 [8] WebSocket ERROR 발생', error);
        },

        onWebSocketClose: () => {
          console.warn('⚡️ [9] WebSocket CLOSED → 자동 재연결 대기중...');
          setConnected(false);
        },

        debug: msg => {
          if (msg.includes('PING') || msg.includes('PONG')) return; // 하트비트 제외
          console.log('🪶 [STOMP DEBUG]', msg);
        },
      });

      console.log('🧩 [10] STOMP Client 인스턴스 생성 완료');
      clientRef.current = client;

      console.log('🚀 [11] STOMP Client 활성화 시작');
      client.activate();
    };

    connect();

    return () => {
      console.group('🧹 useChatWebSocket - Unmount');
      isUnmounted = true;
      if (clientRef.current) {
        console.log('🔌 [12] STOMP DEACTIVATE 호출');
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      console.groupEnd();
      console.groupEnd();
    };
  }, [enabled, memberId]);

  /** ✅ 메시지 구독 */
  const subscribe = (
    destination: string,
    callback: (
      data: ChatMessageModel | MemberChatRoomModel | AlarmModel,
    ) => void,
  ) => {
    console.group('📡 [SUBSCRIBE]');
    console.log('   • 대상:', destination);
    console.log('   • memberId:', memberId);

    if (!clientRef.current) {
      console.warn('❌ [SUBSCRIBE] clientRef가 null입니다.');
      console.groupEnd();
      return null;
    }

    if (!connected) {
      console.warn('❌ [SUBSCRIBE] 아직 연결되지 않았습니다.');
      console.groupEnd();
      return null;
    }

    const sub = clientRef.current.subscribe(
      destination,
      (message: IMessage) => {
        try {
          console.log('📨 [SUBSCRIBE] 수신 메시지:', message.body);
          const body = JSON.parse(message.body);
          callback(body);
        } catch (e) {
          console.error('❌ [SUBSCRIBE] 메시지 파싱 오류', e);
        }
      },
    );

    console.log('✅ [SUBSCRIBE] 구독 성공:', sub.id);
    console.groupEnd();
    return sub;
  };

  /** ✅ 일반 메시지 전송 */
  const sendChatMessage = (destination: string, body: object) => {
    console.group('📤 [SEND MESSAGE]');
    console.log('   • destination:', destination);
    console.log('   • payload:', body);
    console.log('   • memberId:', memberId);

    const client = clientRef.current;
    if (!client || !client.connected) {
      console.error('❌ [SEND] STOMP 연결 안됨 — 메시지 전송 불가');
      console.groupEnd();
      return;
    }

    client.publish({
      destination,
      body: JSON.stringify({
        ...body,
        senderId: memberId, // ✅ 전송자 ID 자동 포함
      }),
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    });

    console.log('✅ [SEND] 메시지 전송 완료');
    console.groupEnd();
  };

  /** ✅ 읽음 처리 메시지 전송 */
  const sendReadChatMessage = (
    chatRoomId: string,
    memberIdParam: string,
    lastReadChatMessageId: string,
  ) => {
    console.group('👀 [SEND READ MESSAGE]');
    console.log('   • chatRoomId:', chatRoomId);
    console.log('   • memberIdParam:', memberIdParam);
    console.log('   • memberId (hook):', memberId);
    console.log('   • lastReadChatMessageId:', lastReadChatMessageId);

    const client = clientRef.current;
    if (!client || !client.connected) {
      console.error('❌ [READ] STOMP 연결 안됨 — 읽음 처리 불가');
      console.groupEnd();
      return;
    }

    const payload = {
      currentChatRoomId: chatRoomId,
      currentMemberId: memberId ?? memberIdParam,
      lastReadChatMessageId,
    };

    client.publish({
      destination: '/app/memberChatRoom/readChatMessage',
      body: JSON.stringify(payload),
    });

    console.log('✅ [READ] 읽음 처리 메시지 전송 완료');
    console.groupEnd();
  };

  return {
    client: clientRef.current,
    connected,
    subscribe,
    sendChatMessage,
    sendReadChatMessage,
  };
}
