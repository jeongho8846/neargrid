import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList'; // ✅ 공용 FlatList
import { COLORS } from '@/common/styles/colors';
import AppZoomableImage from '@/common/components/AppZoomableImage';

const MapScreen = () => {
  const navigation = useNavigation();
  const { headerOffset, handleScroll, HEADER_TOTAL, isAtTop } =
    useCollapsibleHeader(56);

  // ✅ 임시 데이터 (state로 관리)
  const [data, setData] = useState(
    Array.from({ length: 20 }).map((_, i) => ({
      id: i.toString(),
      title: `아이템 ${i + 1}`,
      image: `https://picsum.photos/seed/${i}/100/100`, // 랜덤 이미지
    })),
  );

  // ✅ 끝 도달 시 데이터 추가 (무한 스크롤 예시)
  const loadMore = () => {
    console.log('📌 리스트 끝 도달! 더 불러오기 실행');
    const nextIndex = data.length;
    const more = Array.from({ length: 10 }).map((_, i) => ({
      id: (nextIndex + i).toString(),
      title: `추가 아이템 ${nextIndex + i + 1}`,
      image: `https://picsum.photos/seed/${nextIndex + i}/100/100`,
    }));
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

      {/* ✅ 공용 FlatList 사용 */}
      <AppFlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <AppText style={styles.text}>{item.title}</AppText>
            <AppZoomableImage
              source={{
                uri: 'https://picsum.photos/300/300',
              }}
              style={{ width: 400, height: 400, backgroundColor: 'red' }}
            />
          </View>
        )}
        contentContainerStyle={{ paddingTop: HEADER_TOTAL }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        // ✅ 리스트 끝 도달 이벤트
        onEndReached={loadMore}
        onEndReachedThreshold={0.2} // 화면의 20% 남았을 때 미리 호출
        useTopButton // ✅ 이거 하나로 "맨 위 버튼" 활성화
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
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 1,

    backgroundColor: COLORS.border,
  },
  text: {
    flex: 1,
  },
});
