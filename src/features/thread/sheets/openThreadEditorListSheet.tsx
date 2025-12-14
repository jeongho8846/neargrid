// src/features/thread/sheets/openThreadEditorListSheet.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import MemberItemLabel from '@/features/member/components/MemberItemLabel';
import { EditMemberSimple } from '../model/ThreadModel';
import { memberStorage } from '@/features/member/utils/memberStorage';
import { useDeleteThreadEditMembers } from '../hooks/useDeleteThreadEditMembers';
import { updateThreadCache } from '../utils/updateThreadCache';
import { openInviteEditHubThreadListSheet } from './openInviteEditHubThreadListSheet';

type Props = {
  members: EditMemberSimple[];
  threadOwnerId: string;
  threadId: string;
};

export const openThreadEditorListSheet = ({
  members,
  threadOwnerId,
  threadId,
}: Props) => {
  const { open } = useBottomSheetStore.getState();

  open(
    <ThreadEditorListContent
      members={members}
      threadOwnerId={threadOwnerId}
      threadId={threadId}
    />,
    {
      snapPoints: ['90%'],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
    },
  );
};

const ThreadEditorListContent: React.FC<Props> = ({
  members,
  threadOwnerId,
  threadId,
}) => {
  const navigation = useNavigation<any>();
  const { close } = useBottomSheetStore();
  const queryClient = useQueryClient();
  const [list, setList] = useState<EditMemberSimple[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const { deleteEditMembers, isLoading } = useDeleteThreadEditMembers();

  useEffect(() => {
    let mounted = true;
    memberStorage
      .getMember()
      .then(member => {
        if (!mounted) return;
        setCurrentMemberId(member?.id ?? null);
        setIsOwner(member?.id === threadOwnerId);
      })
      .catch(err =>
        console.error('❌ [openThreadEditorListSheet] member load fail', err),
      );
    return () => {
      mounted = false;
    };
  }, [threadOwnerId]);

  const handlePressMember = (memberId: string) => {
    close();
    navigation.navigate('Profile', { memberId });
  };

  const toggleSelect = (memberId: string) => {
    if (memberId === threadOwnerId) return;
    setSelectedIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0) return;
    const memberIdsPayload = selectedIds;
    const prevList = list;
    const nextList = list.filter(m => !selectedIds.includes(m.id));

    // Optimistic UI + 캐시 갱신
    const sortedNext = sortByOwnerFirst(nextList);
    setList(sortedNext);
    updateThreadCache(queryClient, threadId, {
      editMemberResponseSimpleDtos: sortedNext,
    });

    try {
      await deleteEditMembers({
        threadId,
        memberIds: memberIdsPayload,
        currentMemberId: currentMemberId ?? threadOwnerId,
      });
      setSelectedIds([]);
    } catch (err) {
      console.error('[openThreadEditorListSheet] remove failed', err);
      // rollback
      setList(prevList);
      updateThreadCache(queryClient, threadId, {
        editMemberResponseSimpleDtos: prevList,
      });
      setSelectedIds(memberIdsPayload);
    }
  };

  const removeDisabled = !isOwner || selectedIds.length === 0 || isLoading;

  const sortByOwnerFirst = (items: EditMemberSimple[]) => {
    return [...items].sort((a, b) => {
      if (a.id === threadOwnerId) return -1;
      if (b.id === threadOwnerId) return 1;
      return 0;
    });
  };

  useEffect(() => {
    setList(sortByOwnerFirst(members));
  }, [members, threadOwnerId]);

  const renderItem = ({ item }: { item?: EditMemberSimple | null }) => {
    if ((item as any)?.kind === 'invite') {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.inviteRow}
          onPress={() => {
            if (!currentMemberId) {
              console.warn(
                '[openThreadEditorListSheet] invite pressed but no currentMemberId',
              );
              return;
            }
            openInviteEditHubThreadListSheet({
              targetId: currentMemberId,
              currentMemberId,
              excludeMemberIds: [threadOwnerId, ...list.map(m => m.id)],
              threadId,
              threadOwnerId,
              onBack: () =>
                openThreadEditorListSheet({
                  members: list,
                  threadOwnerId,
                  threadId,
                }),
            });
          }}
        >
          <View style={styles.plusAvatar}>
            <AppText variant="caption" style={styles.plusText}>
              +
            </AppText>
          </View>
          <AppText
            variant="username"
            style={styles.inviteLabel}
            i18nKey="STR_CHAT_INVITE_MEMBER"
          />
        </TouchableOpacity>
      );
    }

    if (!item) return null;
    const isSelected = selectedIds.includes(item.id);
    const isThreadOwner = item.id === threadOwnerId;
    return (
      <MemberItemLabel
        item={{
          id: item.id,
          nickname: item.nickName || item.realName || '',
          profileImageUrl: item.profileImageUrl,
          onPress:
            isOwner && !isThreadOwner
              ? () => toggleSelect(item.id)
              : () => handlePressMember(item.id),
          rightElement:
            isOwner && !isThreadOwner ? (
              <View
                style={[styles.checkbox, isSelected && styles.checkboxChecked]}
              >
                {isSelected && <View style={styles.checkboxDot} />}
              </View>
            ) : null,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText
          i18nKey="STR_THREAD_EDITOR_LIST_TITLE"
          variant="caption"
          style={styles.title}
        />
        {isOwner && (
          <View style={{ position: 'absolute', right: 0 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRemoveSelected}
              disabled={removeDisabled}
            >
              <AppText
                i18nKey="STR_THREAD_EDITOR_REMOVE"
                variant="danger"
                style={[
                  styles.removeButton,
                  removeDisabled && styles.removeButtonDisabled,
                ]}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        data={useMemo(() => [{ kind: 'invite' } as any, ...list], [list])}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          (item as any)?.kind === 'invite'
            ? 'invite'
            : item?.id ?? String(index)
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <AppText
            i18nKey="STR_THREAD_EDITOR_LIST_EMPTY"
            variant="caption"
            style={styles.empty}
          />
        }
      />
    </View>
  );
};

export default ThreadEditorListContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.body,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    left: SPACING.md,
  },
  removeButton: {
    color: COLORS.error,
    marginRight: SPACING.md,
    marginTop: SPACING.sm,
  },
  removeButtonDisabled: {
    color: COLORS.error ?? COLORS.body,
    opacity: 0.4,
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
    borderColor: COLORS.caption,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  checkboxChecked: {
    borderColor: COLORS.caption,
    backgroundColor: COLORS.error,
  },
  checkboxDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  plusAvatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border ?? '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: COLORS.body,
    fontWeight: '700',
  },
  inviteLabel: {
    color: COLORS.body,
  },
});
