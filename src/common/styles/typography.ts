import { TextStyle } from 'react-native';

export const FONT = {
  title: {
    fontSize: 20,
    fontWeight: '700' as TextStyle['fontWeight'], // 화면 제목, 사용자명
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'], // 본문, 버튼, 채팅 메시지
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'], // 시간 표시, 작은 라벨
    color: '#666',
  },
};
