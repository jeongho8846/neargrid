import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import DemoNavigator from '@/test/components/DemoNavigator';
import DemoBottomSheet from '@/test/components/DemoBottomSheet';
import DemoMapCardItem from '@/test/components/DemoMapCardItem';
import MapControlButton from '@/test/components/MapControlButton';
import { useBottomSheetStore } from '../common/state/bottomSheetStore';
import { useBottomSheetVisibility } from '../common/hooks/useBottomSheetVisibility';
import { useNavigation } from '@react-navigation/native';
import DemoTextInput from '../components/DemoTextInput';

const DemoMapScreen = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigation = useNavigation<any>();

  const { setInteracting } = useBottomSheetStore();
  useBottomSheetVisibility(); // ✅ 2초 타이머 + 네비게이터 show/hide 제어

  const handleOpenSheet = () => {
    setOpen(true);
    setInteracting(true); // ✅ 바텀시트 열리는 순간 "인터랙션 중"으로 처리
  };

  const handleCloseSheet = () => {
    setOpen(false);
    setInteracting(true); // ✅ 닫을 때도 한번 더 트리거 → 2초 후 다시 네비게이터 복귀
  };

  return (
    <View style={styles.root}>
      {/* ✅ 상단 바 (My 버튼 + 검색창) */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.myButton}
          onPress={() => {
            setInteracting(true);
            navigation.navigate('DemoSearch');
          }}
        >
          <AppText variant="button">My</AppText>
        </TouchableOpacity>

        {/* ✅ 검색창을 DemoTextInput으로 교체 */}
        <View style={styles.searchWrapper}>
          <DemoTextInput
            placeholder="장소나 태그를 검색하세요"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setInteracting(true)}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => {
                setSearch('');
                setInteracting(true);
              }}
            >
              <AppIcon
                name="close-outline"
                type="ion"
                size={20}
                variant="secondary"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ✅ 지도 placeholder */}
      <View style={styles.mapPlaceholder}>
        <AppText variant="caption">🗺️ 지도 영역</AppText>

        {/* ✅ 지도 제어 버튼들 */}
        <View style={styles.mapControls}>
          <MapControlButton
            icon="add"
            onPress={() => setInteracting(true)} // 🔹 줌 제어도 인터랙션
          />
          <MapControlButton
            icon="remove"
            onPress={() => setInteracting(true)}
          />
          <MapControlButton
            icon="locate-outline"
            style={{ marginTop: 12 }}
            onPress={() => setInteracting(true)}
          />
        </View>

        {/* ✅ “이 지역 게시물 보기” 버튼 → 지도 위로 이동 */}
        <TouchableOpacity
          style={styles.floatingListBtn}
          onPress={handleOpenSheet}
          activeOpacity={0.8}
        >
          <AppText variant="button">이 지역 게시물 보기</AppText>
        </TouchableOpacity>
      </View>

      {/* ✅ 하단 네비게이터 (visibility는 DemoNavigator 안에서 제어됨) */}
      <DemoNavigator />

      {/* ✅ 바텀시트 */}
      <DemoBottomSheet
        visible={open}
        onClose={handleCloseSheet}
        title="이 지역 게시물"
      >
        {/* 🔹 시트 안에서 어떤 터치/스크롤이 발생해도 네비게이터 숨김 유지 */}
        <View
          style={styles.sheetGrid}
          onTouchStart={() => setInteracting(true)}
          onTouchMove={() => setInteracting(true)}
          onTouchEnd={() => setInteracting(true)}
        >
          <DemoMapCardItem likes={32} comments={8} nickname="soyoung" />
          <DemoMapCardItem likes={15} comments={3} nickname="luna" />
        </View>
      </DemoBottomSheet>
    </View>
  );
};

export default DemoMapScreen;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    paddingHorizontal: 8, // ✅ 기억된 설정
    paddingTop: 20,
  },

  /* ───── 상단 바 ───── */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  myButton: {
    backgroundColor: '#4A6CF7',
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
    height: 56,
    width: 56,
    justifyContent: 'center',
  },
  searchWrapper: {
    flex: 1,
    marginLeft: 8,
    position: 'relative',
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },

  /* ───── 지도 영역 ───── */
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  mapControls: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
  },

  /* ───── 지도 위 “목록보기” 버튼 ───── */
  floatingListBtn: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    backgroundColor: '#4A6CF7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },

  /* ───── 바텀시트 ───── */
  sheetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
});
