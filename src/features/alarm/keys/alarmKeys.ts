export const alarmKeys = {
  all: ['alarm'] as const,
  lists: () => [...alarmKeys.all, 'list'] as const,
  list: (memberId?: string) => [...alarmKeys.lists(), memberId] as const,
  pin: (pinId?: string) => [...alarmKeys.all, 'pin', pinId] as const,
};
