export const THREAD_KEYS = {
  all: ['threads'] as const,
  list: (type?: string, memberId?: string, distance?: number | string) =>
    [
      ...THREAD_KEYS.all,
      type ?? 'all',
      memberId ?? '',
      distance ?? '',
    ] as const,
};
