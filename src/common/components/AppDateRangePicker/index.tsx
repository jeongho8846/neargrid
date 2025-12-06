// 📄 src/common/components/AppDateRangePicker/index.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import DatePicker from 'react-native-date-picker';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

type Props = {
  startDate: Date;
  endDate: Date;
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  locale?: string;
  showApplyButton?: boolean;
  onApply?: () => void;
};

/**
 * ✅ AppDateRangePicker
 * - 공용 날짜 범위 선택 컴포넌트
 * - 좌: 달력 아이콘 / 중: 날짜 범위 / 우: 적용 버튼
 */
const AppDateRangePicker: React.FC<Props> = ({
  startDate,
  endDate,
  onChange,
  locale = 'ko',
  showApplyButton = false,
  onApply,
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formattedStart = format(startDate, 'yyyy.MM.dd', { locale: ko });
  const formattedEnd = format(endDate, 'yyyy.MM.dd', { locale: ko });

  return (
    <View style={styles.container}>
      {/* ✅ Left: 달력 아이콘 */}
      <View style={styles.leftSection}>
        <AppIcon name="calendar" type="ion" size={20} variant="secondary" />
      </View>

      {/* ✅ Center: 날짜 범위 */}
      <View style={styles.centerSection}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
          activeOpacity={0.8}
        >
          <AppText variant="body">{formattedStart}</AppText>
        </TouchableOpacity>

        <AppText variant="body">~</AppText>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}
          activeOpacity={0.8}
        >
          <AppText variant="body">{formattedEnd}</AppText>
        </TouchableOpacity>
      </View>

      {/* ✅ Right: 검색(적용) 버튼 */}
      {showApplyButton && onApply && (
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={onApply}
            activeOpacity={0.8}
          >
            <AppText i18nKey="STR_SEARCH" variant="button" />
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ 시작일 선택 모달 */}
      {/* <DatePicker
        modal
        open={showStartPicker}
        date={startDate}
        mode="date"
        theme="dark"
        locale={locale}
        onConfirm={date => {
          setShowStartPicker(false);
          onChange({ startDate: date, endDate });
        }}
        onCancel={() => setShowStartPicker(false)}
      />

      {/* ✅ 종료일 선택 모달 */}
      <DatePicker
        modal
        open={showEndPicker}
        date={endDate}
        mode="date"
        theme="dark"
        locale={locale}
        onConfirm={date => {
          setShowEndPicker(false);
          onChange({ startDate, endDate: date });
        }}
        onCancel={() => setShowEndPicker(false)}
      /> */}
    </View>
  );
};

export default AppDateRangePicker;

const styles = StyleSheet.create({
  /** 전체 컨테이너 */
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderRadius: 10,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },

  /** Left: 아이콘 영역 */
  leftSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },

  /** Center: 날짜 범위 영역 */
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1, // ✅ 가운데 확장
  },
  dateButton: {
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 90,
    alignItems: 'center',
  },

  /** Right: 검색 버튼 */
  rightSection: {
    marginLeft: SPACING.sm,
  },
  applyButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.input_background,
    borderRadius: 8,
    height: 35,
  },
});
