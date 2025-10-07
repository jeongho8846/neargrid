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
import { COLORS } from '@/common/styles/colors';

// ✅ 더미 텍스트 생성 함수
const generateText = (length: number) => '가'.repeat(length);

// ✅ 임시 API 시뮬레이터
const fetchThreadList = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = Array.from({ length: 10 }).map((_, i) => {
        const lengths = [50, 100, 200, 300];
        const textLength = lengths[i % lengths.length];
        return {
          id: i.toString(),
          title: `아이템 ${i + 1}`,
          images:
            i === 0
              ? Array.from({ length: 13 }).map(
                  (_, idx) => `https://picsum.photos/seed/${i}-${idx}/600/600`,
                )
              : [
                  `https://picsum.photos/seed/${i}-1/600/600`,
                  `https://picsum.photos/seed/${i}-2/600/600`,
                  `https://picsum.photos/seed/${i}-3/600/600`,
                ],
          text: generateText(textLength),
        };
      });
      resolve(data);
    }, 2000); // 2초 뒤 데이터 반환
  });
};

const MapScreen = () => {
  const navigation = useNavigation();
  const { headerOffset, handleScroll, HEADER_TOTAL, isAtTop } =
    useCollapsibleHeader(56);

  // ✅ 상태
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 데이터 로드
  useEffect(() => {
    const load = async () => {
      const result: any = await fetchThreadList();
      setData(result);
      setIsLoading(false);
    };
    load();
  }, []);

  // ✅ 무한 스크롤 예시
  const loadMore = async () => {
    console.log('📌 리스트 끝 도달! 더 불러오기 실행');
    const more = await fetchThreadList(); // 여기선 동일 함수 재사용 (API면 page param)
    setData(prev => [...prev, ...more]);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ 공용 해더 */}
      <AppCollapsibleHeader
        titleKey="STR_MAP"
        headerOffset={headerOffset}
        isAtTop={isAtTop}
        onBackPress={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => console.log('검색')}>
            <AppIcon type="ion" name="search" size={22} color={COLORS.text} />
          </TouchableOpacity>
        }
      />

      {/* ✅ 공용 FlatList */}
      <AppFlatList
        data={
          isLoading
            ? Array.from({ length: 5 }).map((_, i) => ({ id: `skeleton-${i}` }))
            : data
        }
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* 제목 */}
            <AppText style={styles.title}>
              {isLoading ? ' ' : item.title}
            </AppText>

            {/* ✅ 이미지 캐러셀 (스켈레톤 포함) */}
            <AppImageCarousel
              images={isLoading ? [] : item.images}
              height={300}
              isLoading={isLoading} // ✅ 전달
            />

            {/* ✅ 본문 텍스트 (스켈레톤 포함) */}
            <View style={styles.textBox}>
              <AppTextField
                text={isLoading ? '' : item.text}
                numberOfLines={3}
                isLoading={isLoading} // ✅ 전달
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
