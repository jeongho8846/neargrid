// src/features/thread/sheets/openInviteEditHubThreadListSheet.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { apiContents } from '@/services/apiService';
import MemberItemLabel from '@/features/member/components/MemberItemLabel';
import { useAddThreadEditMembers } from '../hooks/useAddThreadEditMembers';
import { updateThreadCache } from '../utils/updateThreadCache';
import { EditMemberSimple } from '../model/ThreadModel';
import { useQueryClient } from '@tanstack/react-query';

type InviteCandidate = {
  id: string;
  nickName: string;
  profileImageUrl?: string | null;
};

type Props = {
  targetId: string;
  currentMemberId: string;
  excludeMemberIds?: string[];
  onBack?: () => void;
  threadId: string;
  threadOwnerId: string;
};

export const openInviteEditHubThreadListSheet = ({
  targetId,
  currentMemberId,
  excludeMemberIds = [],
  onBack,
  threadId,
  threadOwnerId,
}: Props) => {
  const { open } = useBottomSheetStore.getState();

  open(
    <InviteEditHubThreadListContent
      targetId={targetId}
      currentMemberId={currentMemberId}
      excludeMemberIds={excludeMemberIds}
      onBack={onBack}
      threadId={threadId}
      threadOwnerId={threadOwnerId}
    />,
    {
      snapPoints: ['90%'],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
    },
  );
};

const InviteEditHubThreadListContent: React.FC<Props> = ({
  targetId,
  currentMemberId,
  excludeMemberIds = [],
  onBack,
  threadId,
  threadOwnerId,
}) => {
  const [followings, setFollowings] = useState<InviteCandidate[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<any>();
  const { close } = useBottomSheetStore();
  const { addEditMembers, isLoading } = useAddThreadEditMembers();
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchFollowings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      onBack?.();
      return true;
    };
    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => sub.remove();
  }, [close, onBack]);

  const fetchFollowings = async () => {
    console.log('📡 [InviteEditHubThreadListSheet] API 호출 시작');
    try {
      setLoading(true);
      const res = await apiContents.get('/follow/getFollowingMembers', {
        params: {
          member_id: targetId,
          current_member_id: currentMemberId,
        },
      });

      const raw = Array.isArray(res.data) ? res.data : [];
      const filtered = raw.filter(
        f => !excludeMemberIds.includes(String((f as any)?.id)),
      );
      setFollowings(filtered as InviteCandidate[]);
    } catch (err: any) {
      console.error(
        '❌ [InviteEditHubThreadListSheet] fetch error:',
        err?.message ?? err,
      );
    } finally {
      setLoading(false);
      console.log('🏁 [InviteEditHubThreadListSheet] API 호출 완료');
    }
  };

  const toggleSelect = (memberId: string) => {
    setSelectedIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId],
    );
  };

  const renderItem = ({ item }: { item: InviteCandidate }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <MemberItemLabel
        item={{
          id: item.id,
          nickname: item.nickName,
          profileImageUrl: item.profileImageUrl,
          onPress: () => toggleSelect(item.id),
          rightElement: (
            <View
              style={[styles.checkbox, isSelected && styles.checkboxChecked]}
            >
              {isSelected && <View style={styles.checkboxDot} />}
            </View>
          ),
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            close();
            onBack?.();
          }}
          style={styles.backButton}
        >
          <AppText
            i18nKey="STR_BACK"
            variant="caption"
            style={styles.backText}
          />
        </TouchableOpacity>
        <AppText
          i18nKey="STR_INVITE_MEMBERS"
          variant="caption"
          style={styles.title}
          isLoading={loading || isLoading}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.inviteButton}
          disabled={selectedIds.length === 0 || isLoading}
          onPress={async () => {
            if (selectedIds.length === 0) return;
            const newMembers: EditMemberSimple[] = followings
              .filter(f => selectedIds.includes(f.id))
              .map(f => ({
                id: f.id,
                nickName: f.nickName,
                profileImageUrl: f.profileImageUrl ?? '',
                realName: '',
                profileText: '',
                memberType: '',
                count: null,
              }));

            try {
              await addEditMembers({
                threadId,
                memberIds: selectedIds,
                currentMemberId: threadOwnerId ?? currentMemberId,
              });
              updateThreadCache(queryClient, threadId, {
                editMemberResponseSimpleDtos: prev => {
                  const existing = Array.isArray(prev) ? prev : [];
                  const existingIds = new Set(existing.map(m => m.id));
                  const merged = [
                    ...existing,
                    ...newMembers.filter(m => !existingIds.has(m.id)),
                  ];
                  return merged;
                },
              });

              onBack?.();
            } catch (err) {
              console.error(
                '[InviteEditHubThreadListSheet] addEditMembers failed',
                err,
              );
            }
          }}
        >
          <AppText
            i18nKey="STR_CHAT_INVITE_MEMBER"
            variant="caption"
            style={[
              styles.inviteText,
              (selectedIds.length === 0 || isLoading) &&
                styles.inviteTextDisabled,
            ]}
          />
        </TouchableOpacity>
      </View>

      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        data={followings}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && (
            <AppText
              i18nKey="STR_FOLLOWING_EMPTY"
              variant="caption"
              style={styles.empty}
            />
          )
        }
      />
    </View>
  );
};

export default InviteEditHubThreadListContent;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.body,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  backButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  backText: {
    color: COLORS.body,
  },
  inviteButton: {
    paddingVertical: SPACING.xs,
  },
  inviteText: {
    color: COLORS.body,
    fontWeight: '600',
  },
  inviteTextDisabled: {
    color: COLORS.border ?? COLORS.body,
    opacity: 0.2,
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
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border ?? '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  checkboxChecked: {
    borderColor: COLORS.button_active,
    backgroundColor: COLORS.button_active,
  },
  checkboxDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
