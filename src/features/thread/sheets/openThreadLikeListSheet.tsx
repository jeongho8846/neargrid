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

type OpenSheetParams = {
  threadId: string;
  currentMemberId?: string | null;
};

export const openThreadLikeListSheet = ({
  threadId,
  currentMemberId,
}: OpenSheetParams) => {
  const { open } = useBottomSheetStore.getState();

  open(
    <ThreadLikeListContent
      threadId={threadId}
      currentMemberId={currentMemberId ?? undefined}
    />,
    {
      snapPoints: ['90%'],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
    },
  );
};

const ThreadLikeListContent: React.FC<OpenSheetParams> = ({
  threadId,
  currentMemberId,
}) => {
  const [members, setMembers] = useState<ReactionMember[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<any>();
  const { close } = useBottomSheetStore();

  useEffect(() => {
    fetchReactionMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, currentMemberId]);

  const fetchReactionMembers = async () => {
    try {
      setLoading(true);

      const res = await apiContents.get('/thread/readThreadReactionMember', {
        params: {
          thread_id: threadId,
          Blankable_current_member_id: currentMemberId ?? undefined,
        },
      });

      console.log(
        '📌 readThreadReactionMember response sample:',
        res.data ?? '(empty)',
      );

      const rawList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : res.data
            ? [res.data]
            : [];

      const mapped: ReactionMember[] = rawList
        .map((m) => {
          const dto = m?.member ?? m?.reactionMember ?? m ?? null;
          const id = dto?.id ?? m?.memberId ?? m?.id;
          if (!id) return null;
          return {
            id: String(id),
            nickName: dto?.nickName ?? dto?.nickname ?? '',
            profileImageUrl: dto?.profileImageUrl ?? null,
          };
        })
        .filter(Boolean) as ReactionMember[];

      setMembers(mapped);
    } catch (err: any) {
      console.error(
        '❌ [openThreadLikeListSheet] fetch error:',
        err?.message ?? err,
      );
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
            console.warn(
              '[openThreadLikeListSheet] missing id for item at index',
              index,
              item,
            );
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
