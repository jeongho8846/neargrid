export const chatKeys = {
  all: ['chat'] as const,

  rooms: () => [...chatKeys.all, 'rooms'] as const,
  messages: (roomId: string) => [...chatKeys.all, 'messages', roomId] as const,
  info: (roomId: string) => [...chatKeys.all, 'info', roomId] as const,
  unreadCount: () => [...chatKeys.all, 'unreadCount'] as const,
};
