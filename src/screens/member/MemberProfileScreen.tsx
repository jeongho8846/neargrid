import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import MemberProfileHeader from '@/features/member/components/MemberProfileHeader';
import { useFetchMemberProfile } from '@/features/member/hooks/useFetchMemberProfile';
import { useFetchFootPrintContents } from '@/features/footprint/hooks/useFetchFootPrintContents';
import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import ThreadItemCard from '@/features/thread/components/thread_item_card';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import ThreadItemDetail from '@/features/thread/components/thread_item_detail';

export default function MemberProfileScreen({ route }) {
  const { member: currentMember } = useCurrentMember();

  // 🔹 route.params.memberId 있으면 다른 유저, 없으면 내 프로필
  const targetUserId = route?.params?.memberId ?? currentMember?.id;

  const { headerOffset, handleScroll, HEADER_TOTAL, isAtTop } =
    useCollapsibleHeader(0);

  /** 👤 프로필 정보 */
  const { data: profile, isLoading: isProfileLoading } = useFetchMemberProfile(
    currentMember?.id ?? '',
    targetUserId ?? '',
    { enabled: !!targetUserId },
  );

  /** 🧭 FootPrint 데이터 가져오기 */
  const { fetchContents, loading: isThreadsLoading } =
    useFetchFootPrintContents();

  const [threads, setThreads] = useState([]);

  useEffect(() => {
    if (!targetUserId) return;

    // ✅ 날짜 포맷 (Spring 호환)
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

        // ✅ 불필요한 depth>0 (대댓글/자식 쓰레드) 필터링
        const filtered = res.filter((t: any) => t.depth === 0);

        setThreads(filtered);
      } catch (err: any) {
        console.error(
          '❌ [ProfileScreen] FootPrint 데이터 로드 실패:',
          err.message,
        );
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
      {/* ✅ 상단 헤더 */}
      <AppCollapsibleHeader
        titleKey="STR_PROFILE"
        headerOffset={headerOffset}
        isAtTop={isAtTop}
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

      {/* ✅ 프로필 + 쓰레드 리스트 */}
      <AppFlatList
        data={threads}
        keyExtractor={item => item.threadId.toString()}
        renderItem={({ item }) => <ThreadItemDetail item={item} />}
        ListHeaderComponent={
          <MemberProfileHeader profile={profile} isLoading={isProfileLoading} />
        }
        onScroll={handleScroll}
        contentPaddingTop={HEADER_TOTAL}
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
          paddingHorizontal: SPACING.sm,
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
