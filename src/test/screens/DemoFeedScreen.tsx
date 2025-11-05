import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import DemoNavigator from '@/test/components/DemoNavigator';
import DemoFeedCard from '@/test/components/DemoFeedCard'; // ✅ 새 컴포넌트 import

const DemoFeedScreen = () => {
  return (
    <View style={styles.root}>
      {/* 상단 헤더 */}
      <View style={styles.headerRow}>
        <AppText variant="title">Feed</AppText>
        <TouchableOpacity>
          <AppIcon
            name="notifications-outline"
            type="ion"
            variant="secondary"
          />
        </TouchableOpacity>
      </View>

      {/* 피드 카드 리스트 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <DemoFeedCard
          username="soyoung"
          time="2h"
          text="햇살 가득한 오후 🌿"
          likes={132}
          comments={12}
        />
        <DemoFeedCard
          username="luna"
          time="5h"
          text="주말엔 커피 한잔 ☕"
          likes={87}
          comments={8}
        />
        <DemoFeedCard
          username="andy"
          time="1d"
          text="새로운 프로젝트 시작!"
          likes={210}
          comments={31}
        />
      </ScrollView>

      {/* 하단 네비게이터 */}
      <DemoNavigator />
    </View>
  );
};

export default DemoFeedScreen;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0E0E0E',

    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
