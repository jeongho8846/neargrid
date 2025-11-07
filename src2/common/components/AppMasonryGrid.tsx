// 📄 src/common/components/AppMasonryGrid.tsx
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import AppFlatList from '@/common/components/AppFlatList';
import { SPACING, COLORS } from '@/common/styles/tokens';
import AppText from '@/common/components/AppText';

type Props = {
  count?: number;
  numColumns?: number;
};

/**
 * ✅ AppMasonryGrid
 * - 내부에서 임시 더미 데이터를 생성
 * - 각 카드 높이/색상을 자동 랜덤 적용
 * - AppFlatList 기반 Masonry 레이아웃
 */
export default function AppMasonryGrid({ count = 30, numColumns = 2 }: Props) {
  // ✅ 임시 데이터 생성
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: String(i),
        title: `아이템 ${i + 1}`,
      })),
    [count],
  );

  // ✅ 랜덤 스타일 생성
  const getRandomStyle = () => {
    const colors = [
      COLORS.surface_light,
      '#f4f4f4',
      '#e9e9e9',
      '#ddd',
      '#ccc',
      '#fafafa',
    ];
    return {
      height: Math.floor(Math.random() * 200) + 80, // 80~280px
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  // ✅ 열 분리
  const columns = useMemo(() => {
    const cols: any[][] = Array.from({ length: numColumns }, () => []);
    data.forEach((item, i) => {
      cols[i % numColumns].push(item);
    });
    return cols;
  }, [data, numColumns]);

  // ✅ Masonry 구조 (AppFlatList로 가상화 유지)
  return (
    <AppFlatList
      data={columns[0].map((_, i) => i)}
      keyExtractor={(_, i) => String(i)}
      renderItem={({ index }) => (
        <View style={styles.row}>
          {columns.map((col, colIndex) => {
            const item = col[index];
            if (!item) return <View key={colIndex} style={styles.emptyCell} />;
            const style = getRandomStyle();
            return (
              <View key={colIndex} style={[styles.card, style]}>
                <AppText>{item.title}</AppText>
              </View>
            );
          })}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.xs / 2,
  },
  emptyCell: {
    flex: 1,
    marginHorizontal: SPACING.xs / 2,
  },
});
