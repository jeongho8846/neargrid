// 📄 src/screens/member/MemberProfileScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated'; // ✅ 추가
import AppFlashList from '@/common/components/AppFlashList/AppFlashList';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import MemberProfileHeader from '@/features/member/components/MemberProfileHeader';
import { useFetchMemberProfile } from '@/features/member/hooks/useFetchMemberProfile';
import { useHeaderScroll } from '@/common/hooks/useHeaderScroll';
import { useTabBarStore } from '@/common/state/tabBarStore'; // ✅ 추가
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useFollowMember } from '@/features/member/hooks/useFollowMember';
import { useMemberProfilePageThreads } from '@/features/member/hooks/useMemberProfilePageThreads';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import ThreadItemDetail from '@/features/thread/components/thread_item_detail';
import { useNavigation } from '@react-navigation/native';
import { openProfileMenuSheet } from '@/features/member/sheets/openProfileMenuSheet';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';
import { MemberProfile } from '@/features/member/model/MemberProfileModel';

export default function MemberProfileScreen({ route }) {
  const { member: currentMember } = useCurrentMember();
  const targetUserId = route?.params?.memberId;

  // ✅ 헤더 스크롤 (Reanimated 기반)
  const { headerStyle, scrollHandler, direction } = useHeaderScroll(56);
  const navigation = useNavigation();

  // ✅ 탭바 제어 (FeedScreen과 동일한 로직)
  const { hide, show } = useTabBarStore();
  useAnimatedReaction(
    () => direction.value,
    dir => {
      runOnJS(dir === 'down' ? hide : show)();
    },
    [],
  );

  /** 👤 프로필 정보 */
  const { data: profileData, isLoading: isProfileLoading } =
    useFetchMemberProfile(
      currentMember?.id ?? '',
      targetUserId ?? '',
      { enabled: !!targetUserId },
    );
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  useEffect(() => {
    setProfile(profileData);
  }, [profileData]);

  const { toggleFollow, loading: isFollowUpdating } = useFollowMember({
    currentMemberId: currentMember?.id,
    targetMemberId: targetUserId,
    onChange: isFollowed => {
      setProfile(prev => {
        if (!prev) return prev;
        const nextFollowerCount =
          typeof prev.followerCount === 'number'
            ? Math.max(
                0,
                prev.followerCount + (isFollowed ? 1 : -1),
              )
            : prev.followerCount;

        return {
          ...prev,
          followedByCurrentMember: isFollowed,
          followerCount: nextFollowerCount,
        };
      });
    },
  });

  useEffect(() => {
    if (profile) {
      console.log('🧭 [MemberProfileScreen] profile:', profile);
    }
  }, [profile]);

  /** 🧭 프로필 스레드 데이터 (React Query) */
  const {
    data: threadPages,
    isLoading: isThreadsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isRefetching,
  } = useMemberProfilePageThreads({
    currentMemberId: currentMember?.id ?? '',
    targetMemberId: targetUserId ?? '',
    enabled: !!targetUserId && !!currentMember?.id,
  });

  const threads = useMemo(
    () =>
      (threadPages?.pages.flatMap(
        page => page?.threadResponseDtoList ?? [],
      ) ?? [])
        .filter((t: any) => t?.depth === 0)
        .sort(
          (a: any, b: any) =>
            new Date(b?.createDatetime).getTime() -
            new Date(a?.createDatetime).getTime(),
        ),
    [threadPages],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* ✅ 헤더 (Reanimated 연결) */}
      <AppCollapsibleHeader
        titleKey="STR_PROFILE"
        animatedStyle={headerStyle}
        onBackPress={() => navigation.goBack()}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* ✅ 내 프로필일 때만 보이는 수정 버튼 */}
            {currentMember?.id === targetUserId && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProfileEdit', { memberId: targetUserId })
                }
              >
                <AppIcon
                  type="ion"
                  name="create-outline"
                  size={22}
                  variant="primary"
                />
              </TouchableOpacity>
            )}

            {/* ✅ 모든 프로필에서 보이는 메뉴 버튼 */}
            <TouchableOpacity
              onPress={() =>
                openProfileMenuSheet({
                  isMyProfile: currentMember?.id === targetUserId,
                  targetMemberId: targetUserId, // ✅ 전달 추가
                })
              }
            >
              <AppIcon
                type="ion"
                name="ellipsis-vertical"
                size={22}
                variant="primary"
              />
            </TouchableOpacity>
          </View>
        }
      />

      {/* ✅ 리스트 */}
      <AppFlashList
        data={threads}
        keyExtractor={item => item.threadId.toString()}
        renderItem={({ item }) => <ThreadItemDetail item={item} />}
        ListHeaderComponent={
          <MemberProfileHeader
            currentMemberId={currentMember?.id}
            profile={profile}
            isLoading={isProfileLoading}
            followLoading={isFollowUpdating}
            onToggleFollow={() =>
              toggleFollow(!!profile?.followedByCurrentMember)
            }
          />
        }
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        isLoading={isProfileLoading || isThreadsLoading || isRefetching}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          !isThreadsLoading && !isRefetching && (
            <View style={styles.emptyContainer}>
              <AppText variant="body" i18nKey="STR_NO_DATA" />
            </View>
          )
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      />
      <BottomBlurGradient height={120}></BottomBlurGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
