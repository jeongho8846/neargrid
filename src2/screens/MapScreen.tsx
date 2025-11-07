import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FeedSkeleton, ProfileSkeleton } from '@/common/components/Skeletons';
import { COLORS, SPACING, RADIUS } from '@/common/styles/tokens';

type Item = { id: string; title: string };

export default function MapScreen() {
  const [data, setData] = useState<Item[] | null>(null);

  useEffect(() => {
    // ⏳ 테스트용 로딩 시뮬레이션 (2초 후 데이터 세팅)
    const timer = setTimeout(() => {
      setData([
        { id: '1', title: '첫 번째 아이템' },
        { id: '2', title: '두 번째 아이템' },
        { id: '3', title: '세 번째 아이템' },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      {/* 상단 프로필 스켈레톤 */}
      {!data && <ProfileSkeleton />}

      {/* 리스트 */}
      <FlatList
        data={data ?? []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>{/* 실제 데이터 표시 */}</View>
        )}
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
  },
  listContent: {
    padding: SPACING.md,
  },
  card: {
    height: 160,
    backgroundColor: COLORS.bg_secondary,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
});
