import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FeedSkeleton, ProfileSkeleton } from '@/common/components/Skeletons';
import { COLORS, SPACING, RADIUS } from '@/common/styles/tokens';
import AppText from '@/common/components/AppText';

type Item = {
  id: string;
  title: string;
  createdAt: string;
  distance: number;
  likeCount: number;
  nickname: string;
};

export default function MapScreen() {
  const [data, setData] = useState<Item[] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        {
          id: '1',
          title: '1분 전 게시물',
          createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(), // 1분 전
          distance: 150,
          likeCount: 12400,
          nickname: 'neargrid_user_1',
        },
        {
          id: '2',
          title: '45분 전 게시물',
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45분 전
          distance: 2400,
          likeCount: 670,
          nickname: 'neargrid_user_2',
        },
        {
          id: '3',
          title: '5시간 전 게시물',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
          distance: 620,
          likeCount: 5000,
          nickname: 'neargrid_user_3',
        },
        {
          id: '4',
          title: '어제 게시물',
          createdAt: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 1,
          ).toISOString(), // 어제
          distance: 1240,
          likeCount: 910,
          nickname: 'neargrid_user_4',
        },
        {
          id: '5',
          title: '3일 전 게시물',
          createdAt: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 3,
          ).toISOString(), // 3일 전
          distance: 500,
          likeCount: 1200000,
          nickname: 'neargrid_user_5',
        },
        {
          id: '6',
          title: '1개월 전 게시물',
          createdAt: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 30,
          ).toISOString(), // 약 한 달 전
          distance: 900,
          likeCount: 120,
          nickname: 'neargrid_user_6',
        },
        {
          id: '7',
          title: '작년 게시물',
          createdAt: new Date('2024-11-08T12:00:00Z').toISOString(), // 1년 전
          distance: 200,
          likeCount: 999999999,
          nickname: 'neargrid_user_7',
        },
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      {/* 번역 */}
      <AppText tKey="STR_COMMON_SAVE" />

      {/* 시간, 거리, 숫자 포맷 */}
      <AppText format="time">{item.createdAt}</AppText>
      <AppText format="distance">{item.distance}</AppText>
      <AppText format="number">{item.likeCount}</AppText>

      {/* 일반 데이터 */}
      <AppText>{item.nickname}</AppText>

      {/* 번역 + 변수 */}
      <AppText tKey="STR_COMMENT_COUNT" values={{ count: item.likeCount }} />
    </View>
  );

  return (
    <View style={styles.root}>
      {!data && <ProfileSkeleton />}
      <FlatList
        data={data ?? []}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<FeedSkeleton />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 100,
  },
  listContent: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
});
