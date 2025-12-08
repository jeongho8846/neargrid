// src/features/thread/sheets/openThreadLikeListSheet.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { apiContents } from '@/services/apiService';
import MemberItemLabel from '@/features/member/components/MemberItemLabel';

type ReactionMember = {
  id: string;
  nickName: string;
  profileImageUrl?: string | null;
};

export const openThreadLikeListSheet = ({ threadId }: { threadId: string }) => {
  const { open } = useBottomSheetStore.getState();

  open(<ThreadLikeListContent threadId={threadId} />, {
    snapPoints: ['90%'],
    initialIndex: 1,
    enableHandlePanningGesture: true,
    enableContentPanningGesture: true,
  });
};

const ThreadLikeListContent: React.FC<{ threadId: string }> = ({ threadId }) => {
  const [members, setMembers] = useState<ReactionMember[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<any>();
  const { close } = useBottomSheetStore();

  useEffect(() => {
    fetchReactionMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const fetchReactionMembers = async () => {
    try {
      setLoading(true);

      const res = await apiContents.get('/thread/readThreadReactionMember', {
        params: { thread_id: threadId },
      });

      console.log('📌 readThreadReactionMember response sample:', res.data?.[0] ?? '(empty)');

      const data: any[] = Array.isArray(res.data) ? res.data : [];

      // 디버그: 비정상 항목이 있으면 로그 남김
      const badItems = data.filter((d) => !d || d.id === undefined || d.id === null);
      if (badItems.length > 0) {
        console.warn('[openThreadLikeListSheet] found items with missing id:', badItems);
      }

      // id가 있는 항목만 매핑해서 상태에 넣음 (방어적)
      const mapped: ReactionMember[] = data
      .filter((m) => m?.member?.id)
      .map((m) => ({
        id: String(m.member.id),
        nickName: m.member.nickName ?? '',
        profileImageUrl: m.member.profileImageUrl ?? null,
      }));

      setMembers(mapped);
    } catch (err: any) {
      console.error('❌ [openThreadLikeListSheet] fetch error:', err?.message ?? err);
    } finally {
      setLoading(false);
      console.log('🏁 [openThreadLikeListSheet] fetch complete');
    }
  };

  const handlePressMember = (memberId: string) => {
    close();
    navigation.navigate('Profile', { memberId });
  };

  const renderItem = ({ item }: { item?: ReactionMember | null }) => {
    if (!item) return null;
    return (
      <MemberItemLabel
        item={{
          id: item.id,
          nickname: item.nickName,
          profileImageUrl: item.profileImageUrl,
          onPress: () => handlePressMember(item.id),
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AppText
        i18nKey="STR_LIKE_LIST"
        variant="caption"
        style={styles.title}
        isLoading={loading}
      />

      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        data={members}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          if (!item || item.id === undefined || item.id === null) {
            console.warn('[openThreadLikeListSheet] missing id for item at index', index, item);
            return String(index);
          }
          return String(item.id);
        }}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && (
            <AppText
              i18nKey="STR_NO_LIKES"
              variant="caption"
              style={styles.empty}
            />
          )
        }
      />
    </View>
  );
};

export default ThreadLikeListContent;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.body,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  listContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  empty: {
    alignSelf: 'center',
    color: COLORS.body,
    marginTop: SPACING.lg,
  },
});
