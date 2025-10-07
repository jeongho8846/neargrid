import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';

import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import AppTextField from '@/common/components/AppTextField';
import AppImageCarousel from '@/common/components/AppImageCarousel';
import AppToast from '@/common/components/AppToast';
import AppDialog from '@/common/components/AppDialog';
import AppBadge from '@/common/components/AppBadge'; // ✅ 배지 추가
import { COLORS } from '@/common/styles/colors';

// ✅ 더미 텍스트 생성 함수
const generateText = (length: number) => '가'.repeat(length);

// ✅ 임시 API 시뮬레이터 (페이지 단위로)
const fetchThreadList = async (page = 0, size = 10) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const startIndex = page * size;
      const data = Array.from({ length: size }).map((_, i) => {
        const index = startIndex + i;
        const lengths = [50, 100, 200, 300];
        const textLength = lengths[index % lengths.length];
        return {
          id: index.toString(),
          title: `아이템 ${index + 1}`,
          images:
            index % 3 === 0
              ? Array.from({ length: 13 }).map(
                  (_, idx) =>
                    `https://picsum.photos/seed/${index}-${idx}/600/600`,
                )
              : [
                  `https://picsum.photos/seed/${index}-1/600/600`,
                  `https://picsum.photos/seed/${index}-2/600/600`,
                  `https://picsum.photos/seed/${index}-3/600/600`,
                ],
          text: generateText(textLength),
        };
      });
      resolve(data);
    }, 1000);
  });
};

const MapScreen = () => {
  const navigation = useNavigation();
  const { headerOffset, handleScroll, HEADER_TOTAL, isAtTop } =
    useCollapsibleHeader(56);

  // ✅ 상태
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ✅ Toast & Dialog & Badge 상태
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  // ✅ 최초 로드
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await fetchThreadList(0);
      setData(result);
      setIsLoading(false);
    };
    load();
  }, []);

  // ✅ 무한 스크롤
  const loadMore = async () => {
    if (isLoading || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const more = await fetchThreadList(nextPage);
    setData(prev => [...prev, ...more]);
    setPage(nextPage);
    setIsLoadingMore(false);

    // ✅ 토스트 & 배지 표시
    setToastMessage(`새 게시물 ${more.length}개 불러왔어요`);
    setToastVisible(true);
    setShowBadge(true); // ✅ 새 데이터가 들어오면 배지 표시
  };

  // ✅ 스켈레톤용 placeholder 데이터
  const skeletonData = Array.from({ length: 5 }).map((_, i) => ({
    id: `skeleton-${i}`,
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ 공용 해더 */}
      <AppCollapsibleHeader
        titleKey="STR_MAP"
        headerOffset={headerOffset}
        isAtTop={isAtTop}
        onBackPress={() => navigation.goBack()}
        right={
          <View style={{ width: 28, height: 28 }}>
            <TouchableOpacity
              onPress={() => {
                setDialogVisible(true);
                setShowBadge(false); // ✅ 다이얼로그 열면 배지 초기화
              }}
            >
              <AppIcon
                type="ion"
                name="ellipsis-vertical"
                size={22}
                color={COLORS.text}
              />
            </TouchableOpacity>

            {/* ✅ 아이콘 오른쪽 상단에 배지 표시 */}
            {showBadge && (
              <View style={{ position: 'absolute', top: -2, right: -2 }}>
                <AppBadge count={100} /> {/* ✅ 숫자 전달 */}
              </View>
            )}
          </View>
        }
      />

      {/* ✅ 공용 FlatList */}
      <AppFlatList
        data={isLoading ? skeletonData : data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <AppText style={styles.title}>
              {isLoading ? ' ' : item.title}
            </AppText>

            <AppImageCarousel
              images={isLoading ? [] : item.images}
              height={300}
              isLoading={isLoading}
            />

            <View style={styles.textBox}>
              <AppTextField
                text={isLoading ? '' : item.text}
                numberOfLines={3}
                isLoading={isLoading}
              />
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingTop: HEADER_TOTAL }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        useTopButton
        loadingMore={isLoadingMore}
      />

      {/* ✅ AppDialog */}
      <AppDialog
        visible={dialogVisible}
        title="새 알림 확인"
        message="새 게시물이 추가되었습니다. 확인하시겠습니까?"
        confirmText="확인"
        cancelText="닫기"
        onCancel={() => setDialogVisible(false)}
        onConfirm={() => {
          setDialogVisible(false);
          setToastMessage('확인되었습니다 ✅');
          setToastVisible(true);
        }}
      />

      {/* ✅ AppToast */}
      <AppToast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
        position="bottom"
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingBottom: 16,
  },
  title: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  textBox: {
    width: '100%',
    marginTop: 8,
  },
});
