import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AppText from '@/common/components/AppText';
import DemoListItem from '@/test/components/DemoListItem';
import DemoNavigator from '@/test/components/DemoNavigator';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_SPACING } from '@/test/styles/spacing';

/**
 * ✅ DemoAlarmScreen
 * - 테스트용 알림 리스트 화면
 * - DemoListItem 재활용
 * - 하단 네비게이터 포함
 */
const DemoAlarmScreen = () => {
  const alarms = [
    {
      title: '새 댓글이 달렸습니다',
      subtitle: '“햇살 가득한 오후 🌿” 게시글에 새 댓글이 있어요.',
      rightText: '2m',
    },
    {
      title: '좋아요 알림',
      subtitle: 'luna 님이 회원님의 게시글을 좋아합니다.',
      rightText: '5m',
    },
    {
      title: '새 팔로워',
      subtitle: 'andy 님이 회원님을 팔로우하기 시작했습니다.',
      rightText: '1h',
    },
    {
      title: '게시글이 공유되었습니다',
      subtitle: '“주말엔 커피 한잔 ☕”이 공유되었어요.',
      rightText: '3h',
    },
  ];

  return (
    <View style={styles.root}>
      {/* 🔹 상단 헤더 */}
      <View style={styles.headerRow}>
        <AppText variant="title">Alarm</AppText>
      </View>

      {/* 🔹 알림 리스트 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {alarms.map((item, index) => (
          <DemoListItem
            key={index}
            title={item.title}
            subtitle={item.subtitle}
            rightText={item.rightText}
          />
        ))}
      </ScrollView>

      {/* 🔹 하단 네비게이터 */}
      <DemoNavigator />
    </View>
  );
};

export default DemoAlarmScreen;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TEST_COLORS.background,
    paddingHorizontal: 8, // ✅ 기억된 설정
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: TEST_SPACING.sm,
  },
});
