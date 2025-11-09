// 📄 src/screens/member/MemberProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import MemberProfileHeader from '@/features/member/components/MemberProfileHeader';
import { useFetchMemberProfile } from '@/features/member/hooks/useFetchMemberProfile';
import { useFetchFootPrintContents } from '@/features/footprint/hooks/useFetchFootPrintContents';
import { useHeaderScroll } from '@/common/hooks/useHeaderScroll'; // ✅ 변경된 훅
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import ThreadItemDetail from '@/features/thread/components/thread_item_detail';

export default function MemberProfileScreen({ route }) {
  const { member: currentMember } = useCurrentMember();
  const targetUserId = route?.params?.memberId;

  // ✅ Reanimated 기반 헤더 스크롤
  const { headerStyle, scrollHandler } = useHeaderScroll(56);

  /** 👤 프로필 정보 */
  const { data: profile, isLoading: isProfileLoading } = useFetchMemberProfile(
    currentMember?.id ?? '',
    targetUserId ?? '',
    { enabled: !!targetUserId },
  );

  /** 🧭 FootPrint 데이터 */
  const { fetchContents, loading: isThreadsLoading } =
    useFetchFootPrintContents();

  const [threads, setThreads] = useState([]);

  useEffect(() => {
    if (!targetUserId) return;
    const toIso = (d: Date) => d.toISOString().slice(0, 19);
    const startDate = new Date('2025-01-01T00:00:00');
    const endDate = new Date();

    const load = async () => {
      try {
        const res = await fetchContents({
          memberId: targetUserId,
          startDateTime: toIso(startDate),
          endDateTime: toIso(endDate),
        });

        console.log('📦 [ProfileScreen] FootPrint Response:', res);

        const filtered = res.filter((t: any) => t.depth === 0);
        setThreads(filtered);
      } catch (err: any) {
        console.error('❌ FootPrint 로드 실패:', err.message);
        console.error(
          '📛 서버 응답:',
          err.response?.data || '(서버 응답 없음)',
        );
      }
    };

    load();
  }, [targetUserId, fetchContents]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* ✅ 헤더 (Reanimated 연결) */}
      <AppCollapsibleHeader
        titleKey="STR_PROFILE"
        animatedStyle={headerStyle} // ✅ 변경
        onBackPress={() => console.log('뒤로가기')}
        right={
          <TouchableOpacity onPress={() => console.log('설정')}>
            <AppIcon
              type="ion"
              name="settings-outline"
              size={22}
              variant="primary"
            />
          </TouchableOpacity>
        }
      />

      {/* ✅ 리스트 */}
      <AppFlatList
        data={threads}
        keyExtractor={item => item.threadId.toString()}
        renderItem={({ item }) => <ThreadItemDetail item={item} />}
        ListHeaderComponent={
          <MemberProfileHeader profile={profile} isLoading={isProfileLoading} />
        }
        onScroll={scrollHandler} // ✅ 변경
        scrollEventThrottle={16} // ✅ 추가 (필수)
        isLoading={isProfileLoading || isThreadsLoading}
        ListEmptyComponent={
          !isThreadsLoading && (
            <View style={styles.emptyContainer}>
              <AppText variant="body" i18nKey="STR_NO_DATA" />
            </View>
          )
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
