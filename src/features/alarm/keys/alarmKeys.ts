/**
 * 🗝️ Alarm 관련 React Query 키 정의
 */
export const ALARM_KEYS = {
  all: ['alarms'] as const,
  list: (memberId: string) => [...ALARM_KEYS.all, 'list', memberId] as const,
};
