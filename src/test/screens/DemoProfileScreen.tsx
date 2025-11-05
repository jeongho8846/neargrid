import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import AppButton from '@/common/components/AppButton';
import DemoNavigator from '@/test/components/DemoNavigator';
import DemoFeedCard from '@/test/components/DemoFeedCard';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';

const { width } = Dimensions.get('window');

/**
 * ✅ DemoProfileScreen
 * - 프로필 전체 레이아웃 + 팔로우 버튼 + 게시글 리스트
 */
const DemoProfileScreen = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowing(prev => !prev);
  };

  const stats = [
    { label: '팔로워', value: 1200 },
    { label: '팔로잉', value: 856 },
    { label: '도네이션', value: 34 },
    { label: '받은 도네', value: 112 },
    { label: '게시글', value: 87 },
    { label: '댓글', value: 421 },
    { label: '멘션', value: 12 },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* 🔹 배경 이미지 */}
        <Image
          source={{ uri: 'https://picsum.photos/900/400' }}
          style={styles.coverImage}
        />

        {/* 🔹 프로필 섹션 */}
        <View style={styles.profileSection}>
          <AppProfileImage size={100} />

          {/* 닉네임 */}
          <AppText variant="username" style={styles.nickname}>
            soyoung
          </AppText>

          {/* 소개글 */}
          <AppText variant="caption" style={styles.bio}>
            따뜻한 햇살과 커피 한 잔을 좋아합니다 ☕
          </AppText>

          {/* ✅ 팔로우 / 언팔로우 버튼 */}
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.following]}
            onPress={handleToggleFollow}
            activeOpacity={0.8}
          >
            <AppText
              variant="button"
              style={{
                color: isFollowing
                  ? TEST_COLORS.text_primary
                  : TEST_COLORS.background,
              }}
            >
              {isFollowing ? '언팔로우' : '팔로우'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* 🔹 통계 Row */}
        <View style={styles.statsContainer}>
          {stats.map((item, index) => (
            <View key={index} style={styles.statItem}>
              <AppText variant="title">{item.value}</AppText>
              <AppText variant="caption" style={styles.statLabel}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 🔹 피드 리스트 */}
        <View>
          <DemoFeedCard
            username="soyoung"
            time="1h"
            text="새로운 하루의 시작 ☀️"
            likes={132}
            comments={12}
          />
          <DemoFeedCard
            username="soyoung"
            time="3h"
            text="카페에서 커피 한 잔 ☕"
            likes={87}
            comments={8}
          />
        </View>
      </ScrollView>

      {/* 🔹 하단 네비게이터 */}
      <DemoNavigator />
    </View>
  );
};

export default DemoProfileScreen;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TEST_COLORS.background,
  },
  coverImage: {
    width: width,
    height: 500,
    backgroundColor: TEST_COLORS.surface_light,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: TEST_SPACING.md,
  },
  nickname: {
    marginTop: TEST_SPACING.sm,
  },
  bio: {
    color: TEST_COLORS.text_secondary,
    textAlign: 'center',
    marginTop: TEST_SPACING.xs,
    marginBottom: TEST_SPACING.sm,
  },
  followButton: {
    backgroundColor: TEST_COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: TEST_RADIUS.sm,
  },
  following: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: TEST_COLORS.text_secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: TEST_COLORS.surface,
    borderRadius: TEST_RADIUS.md,
    marginHorizontal: TEST_SPACING.md,
    paddingVertical: TEST_SPACING.md,
    marginBottom: TEST_SPACING.md,
  },
  statItem: {
    width: width / 3.5,
    alignItems: 'center',
    marginVertical: TEST_SPACING.xs,
  },
  statLabel: {
    color: TEST_COLORS.text_secondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: TEST_COLORS.border,
    marginHorizontal: TEST_SPACING.sm,
    marginBottom: TEST_SPACING.sm,
  },
});
