import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList'; // ✅ 공용 FlatList
import { COLORS } from '@/common/styles/colors';
import AppTextField from '@/common/components/AppTextField'; // ✅ 본문 텍스트
import AppImageCarousel from '@/common/components/AppImageCarousel'; // ✅ 새로 만든 공용 캐러셀

// 더미 텍스트 생성 함수
const generateText = (length: number) => '가'.repeat(length);

const MapScreen = () => {
  const navigation = useNavigation();
  const { headerOffset, handleScroll, HEADER_TOTAL, isAtTop } =
    useCollapsibleHeader(56);

  // ✅ 임시 데이터 (여러 장 이미지 포함)
  // ✅ 임시 데이터 (여러 장 이미지 포함)
  const [data, setData] = useState(
    Array.from({ length: 10 }).map((_, i) => {
      const lengths = [50, 100, 200, 300];
      const textLength = lengths[i % lengths.length];

      return {
        id: i.toString(),
        title: `아이템 ${i + 1}`,

        // ✅ 첫 번째 아이템은 13장 이미지
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
    }),
  );

  // ✅ 끝 도달 시 데이터 추가 (무한 스크롤 예시)
  const loadMore = () => {
    console.log('📌 리스트 끝 도달! 더 불러오기 실행');
    const nextIndex = data.length;
    const more = Array.from({ length: 5 }).map((_, i) => {
      const lengths = [50, 100, 200, 300];
      const textLength = lengths[(nextIndex + i) % lengths.length];
      return {
        id: (nextIndex + i).toString(),
        title: `추가 아이템 ${nextIndex + i + 1}`,
        images: [
          `https://picsum.photos/seed/${nextIndex + i}-1/600/600`,
          `https://picsum.photos/seed/${nextIndex + i}-2/600/600`,
        ],
        text: generateText(textLength),
      };
    });
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
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* 제목 */}
            <AppText style={styles.title}>{item.title}</AppText>

            {/* ✅ 여러 장 이미지 캐러셀 */}
            <AppImageCarousel images={item.images} height={300} />

            {/* ✅ 이미지 하단 텍스트 */}
            <View style={styles.textBox}>
              <AppTextField text={item.text} numberOfLines={3} />
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
