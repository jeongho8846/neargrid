import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';

const THREAD_TYPES = [
  'GENERAL_THREAD',
  'MOMENT_THREAD',
  'PLAN_TO_VISIT_THREAD',
  'ROUTE_THREAD',
];

const typeLabelMap: Record<string, { label: string; color: string }> = {
  GENERAL_THREAD: { label: 'GENERAL', color: COLORS.caption },
  MOMENT_THREAD: { label: 'MOMENT', color: '#31FFF5' },
  PLAN_TO_VISIT_THREAD: { label: 'PLAN', color: '#8995FF' },
  ROUTE_THREAD: { label: 'ROUTE', color: '#ED7F07' },
};

const RECENT_TIMES = [
  { i18nKey: 'STR_5MIN', value: 5 },
  { i18nKey: 'STR_30MIN', value: 30 },
  { i18nKey: 'STR_4HOURS', value: 60 * 4 },
  { i18nKey: 'STR_1DAY', value: 60 * 24 },
  { i18nKey: 'STR_1WEEK', value: 60 * 24 * 7 },
  { i18nKey: 'STR_1MONTH', value: 60 * 24 * 30 },
  { i18nKey: 'STR_6MONTHS', value: 60 * 24 * 30 * 6 },
  { i18nKey: 'STR_1YEAR', value: 60 * 24 * 365 },
  { i18nKey: 'STR_UNLIMITED', value: 60 * 24 * 365 * 999 },
];

const REMAIN_TIMES = [
  { i18nKey: 'STR_5MIN', value: 5 },
  { i18nKey: 'STR_30MIN', value: 30 },
  { i18nKey: 'STR_4HOURS', value: 60 * 4 },
  { i18nKey: 'STR_1DAY', value: 60 * 24 },
  { i18nKey: 'STR_1WEEK', value: 60 * 24 * 7 },
  { i18nKey: 'STR_1MONTH', value: 60 * 24 * 30 },
  { i18nKey: 'STR_6MONTHS', value: 60 * 24 * 30 * 6 },
  { i18nKey: 'STR_1YEAR', value: 60 * 24 * 365 },
];

const MapSearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedThreadTypes, setSelectedThreadTypes] =
    useState<string[]>(THREAD_TYPES);
  const [recentTime, setRecentTime] = useState<number>(60 * 24 * 365 * 999);
  const [remainTime, setRemainTime] = useState<number>(60 * 24 * 365);
  const [includePastRemainTime, setIncludePastRemainTime] = useState(false);

  const toggleThreadType = (type: string) => {
    setSelectedThreadTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
    );
  };

  /** ✅ 검색 버튼 → MapScreen params 전달 + 뒤로가기 */
  const handleSearch = (keyword?: string) => {
    const query = (keyword ?? searchText).trim();

    const searchParams = {
      inputSearchText: query || '',
      filterOptions: {
        thread_types: selectedThreadTypes,
        recent_time_minute: recentTime,
        remain_time_minute: remainTime,
        is_include_past_remain_date_time: includePastRemainTime,
      },
    };

    // ✅ 올바른 방식 (React Navigation v6)
    navigation.navigate({
      name: 'Map', // 📍 MapScreen 이름과 동일해야 함
      params: searchParams,
      merge: true,
    });

    // ✅ 뒤로가기
    // navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* ✅ 헤더 */}
      <AppCollapsibleHeader
        titleKey="STR_SEARCH"
        isAtTop={false}
        onBackPress={() => navigation.goBack()}
      />
      {/* ✅ 검색창 */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="검색어를 입력하세요"
            placeholderTextColor={COLORS.caption}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => handleSearch()}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchText('')}
            >
              <AppIcon name="close" size={18} variant="secondary" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch()}
        >
          <AppText i18nKey="STR_SEARCH" variant="button" />
        </TouchableOpacity>
      </View>

      {/* ✅ Thread Type 선택 */}
      <AppText
        i18nKey="STR_THREAD_TYPES"
        variant="caption"
        style={styles.sectionTitle}
      />
      <View style={styles.row}>
        {THREAD_TYPES.map(type => {
          const isActive = selectedThreadTypes.includes(type);
          const { label, color } = typeLabelMap[type];
          return (
            <TouchableOpacity
              key={type}
              onPress={() => toggleThreadType(type)}
              style={[styles.filterButton, isActive && { borderColor: color }]}
            >
              <AppText variant="body" style={{ color }}>
                {label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ✅ 최근/남은 시간 */}
      <AppText
        i18nKey="STR_RECENT_TIME"
        variant="caption"
        style={styles.sectionTitle}
      />
      <View style={styles.row}>
        {RECENT_TIMES.map(opt => {
          const isActive = recentTime === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.filterButton, isActive && styles.activeButton]}
              onPress={() => setRecentTime(opt.value)}
            >
              <AppText
                i18nKey={opt.i18nKey}
                variant="body"
                style={{
                  color: isActive ? COLORS.button_variant : COLORS.caption,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <AppText
        i18nKey="STR_REMAIN_TIME"
        variant="caption"
        style={styles.sectionTitle}
      />
      <View style={styles.row}>
        {REMAIN_TIMES.map(opt => {
          const isActive = remainTime === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.filterButton, isActive && styles.activeButton]}
              onPress={() => setRemainTime(opt.value)}
            >
              <AppText
                i18nKey={opt.i18nKey}
                variant="body"
                style={{
                  color: isActive ? COLORS.button_variant : COLORS.caption,
                }}
              />
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={[
            styles.filterButton,
            includePastRemainTime && styles.activeButton,
          ]}
          onPress={() => setIncludePastRemainTime(prev => !prev)}
        >
          <AppText
            i18nKey="STR_INCLUDE_EXPIRED"
            variant="body"
            style={{
              color: includePastRemainTime
                ? COLORS.button_variant
                : COLORS.caption,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingTop: 80,
  },
  headerText: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  searchBox: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.sheet_handle,
    borderRadius: 8,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    color: COLORS.body,
  },
  clearButton: {
    padding: 6,
  },
  searchButton: {
    marginLeft: SPACING.xs,
    backgroundColor: COLORS.button_active,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  filterButton: {
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.sheet_handle,
    margin: 4,
  },
  activeButton: {
    backgroundColor: COLORS.button_active,
    borderColor: COLORS.button_active,
  },
});
