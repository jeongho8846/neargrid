// src/features/map/components/MapSearchBottomSheet.tsx
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

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

export type MapSearchBottomSheetRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  onSearch: (params: {
    keyword: string;
    threadTypes: string[];
    recentTimeMinute: number;
    remainTimeMinute: number;
    includePastRemainTime: boolean;
  }) => void;
  onClose?: () => void;
  currentSearchParams: {
    keyword: string;
    threadTypes: string[];
    recentTimeMinute: number;
    remainTimeMinute: number;
    includePastRemainTime: boolean;
  };
};

const MapSearchBottomSheet = forwardRef<MapSearchBottomSheetRef, Props>(
  ({ onSearch, onClose, currentSearchParams }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedThreadTypes, setSelectedThreadTypes] =
      useState<string[]>(THREAD_TYPES);
    const [recentTime, setRecentTime] = useState<number>(60 * 24 * 365 * 999);
    const [remainTime, setRemainTime] = useState<number>(60 * 24 * 365);
    const [includePastRemainTime, setIncludePastRemainTime] = useState(false);

    // ✅ currentSearchParams가 변경되면 상태 동기화
    useEffect(() => {
      setSearchText(currentSearchParams.keyword);
      setSelectedThreadTypes(currentSearchParams.threadTypes);
      setRecentTime(currentSearchParams.recentTimeMinute);
      setRemainTime(currentSearchParams.remainTimeMinute);
      setIncludePastRemainTime(currentSearchParams.includePastRemainTime);
    }, [currentSearchParams]);

    const setSheetOpen = useCallback((open: boolean) => {
      useBottomSheetStore.setState({ isOpen: open });
    }, []);

    useEffect(() => {
      setSheetOpen(true); // 렌더 시점엔 이미 열려 있으므로 탭바 숨김
      return () => setSheetOpen(false);
    }, [setSheetOpen]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setSheetOpen(true);
        sheetRef.current?.snapToIndex(0);
      },
      close: () => {
        setSheetOpen(false);
        sheetRef.current?.close();
      },
    }));

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index >= 0) {
          setSheetOpen(true);
        }
        if (index === -1) {
          setSheetOpen(false);
          onClose?.();
        }
      },
      [onClose, setSheetOpen],
    );

    const toggleThreadType = (type: string) => {
      setSelectedThreadTypes(prev =>
        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
      );
    };

    const handleSearch = () => {
      // ✅ 키보드 닫기
      Keyboard.dismiss();

      onSearch({
        keyword: searchText.trim(),
        threadTypes: selectedThreadTypes,
        recentTimeMinute: recentTime,
        remainTimeMinute: remainTime,
        includePastRemainTime,
      });

      sheetRef.current?.close();
      setSheetOpen(false);
    };

    return (
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={['100%']}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.container}>
          {/* 검색창 */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="검색어를 입력하세요"
                placeholderTextColor={COLORS.caption}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
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
              onPress={handleSearch}
            >
              <AppText i18nKey="STR_SEARCH" variant="button" />
            </TouchableOpacity>
          </View>

          {/* Thread Type */}
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
                  style={[
                    styles.filterButton,
                    isActive && { borderColor: color },
                  ]}
                >
                  <AppText variant="body" style={{ color }}>
                    {label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Recent Time */}
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

          {/* Remain Time */}
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
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

export default MapSearchBottomSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: COLORS.background,
  },
  handleIndicator: {
    backgroundColor: COLORS.sheet_handle,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    zIndex: 99,
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
