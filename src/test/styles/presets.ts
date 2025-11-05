import { TEST_COLORS } from './colors';
import { TEST_RADIUS } from './radius';
import { TEST_SHADOW } from './shadows';

/**
 * ✅ 공통 스타일 프리셋
 * - 버튼, 카드 등 자주 쓰이는 조합
 */

export const TEST_PRESETS = {
  buttonBase: {
    height: 48,
    borderRadius: TEST_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    ...TEST_SHADOW.base,
  },

  buttonPrimary: {
    backgroundColor: TEST_COLORS.primary,
  },

  cardBase: {
    backgroundColor: TEST_COLORS.surface,
    borderRadius: TEST_RADIUS.lg,
    padding: 14,
    ...TEST_SHADOW.soft,
  },

  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: TEST_RADIUS.md,
    backgroundColor: TEST_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...TEST_SHADOW.base,
  },
};
