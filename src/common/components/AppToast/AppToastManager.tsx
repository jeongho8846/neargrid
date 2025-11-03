import React, { useState, useCallback } from 'react';
import AppToastUI from './index'; // ✅ UI 컴포넌트 이름 변경 import

/**
 * ✅ 전역 Toast 상태 컨트롤
 */
let showToast: ((message: string, duration?: number) => void) | null = null;

export const AppToastContainer: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(2000);

  const hide = useCallback(() => setVisible(false), []);

  showToast = (msg: string, dur = 2000) => {
    setMessage(msg);
    setDuration(dur);
    setVisible(true);
  };

  // ✅ 반드시 JSX 반환 (ReactNode)
  return (
    <AppToastUI
      visible={visible}
      message={message}
      duration={duration}
      position="bottom"
      onHide={hide}
    />
  );
};

/**
 * ✅ 어디서든 AppToastManager.show('메시지') 로 호출 가능
 */
const AppToastManager = {
  show(message: string, duration?: number) {
    if (showToast) {
      showToast(message, duration);
    } else {
      console.warn('⚠️ AppToastContainer가 렌더링되어 있지 않습니다.');
    }
  },
};

export default AppToastManager;
