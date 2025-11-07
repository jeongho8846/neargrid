import { StyleSheet } from 'react-native';
import { COLORS } from '@/common/styles/tokens/colors';

export const LAYOUT = StyleSheet.create({
  /** ✅ 기본 스크린 컨테이너 */
  screen: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: COLORS.background,
  },

  /** ✅ 가운데 정렬 화면 */
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  /** ✅ 스크롤 컨테이너 기본 */
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 8,
    backgroundColor: COLORS.background,
  },
});
