import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppFlashList from '@/common/components/AppFlashList/AppFlashList';
import AppText from '@/common/components/AppText';
import AppButton from '@/common/components/AppButton';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import ThreadItemDetail from '@/features/thread/components/thread_item_detail';
import { useAttachThreadToHubThread } from '@/features/thread/hooks/useAttachThreadToHubThread';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useMemberProfilePageThreads } from '@/features/member/hooks/useMemberProfilePageThreads';
import { Thread, mapServerThread } from '@/features/thread/model/ThreadModel';

type AttachMyThreadRoute = RouteProp<
  {
    AttachMyThreadModal: {
      onConfirm?: (threads: Thread[]) => void;
      initialSelectedIds?: string[];
      hubThreadId?: string;
    };
  },
  'AttachMyThreadModal'
>;

/**
 * ✅ 내 쓰레드 선택 풀스크린 모달
 * - 상단: 선택된 쓰레드 가로 리스트 (제거 가능)
 * - 본문: 내 쓰레드 목록 (MemberProfile과 동일 API, 타겟=내 아이디)
 */
const AttachMyThreadModal: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<AttachMyThreadRoute>();
  const { member } = useCurrentMember();
  const initialIds = route.params?.initialSelectedIds ?? [];
  const hubThreadIdFromParams = route.params?.hubThreadId;

  const {
    data: threadPages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isRefetching,
  } = useMemberProfilePageThreads({
    currentMemberId: member?.id ?? '',
    targetMemberId: member?.id ?? '',
    enabled: !!member?.id,
  });

  const threads: Thread[] = useMemo(
    () =>
      (
        threadPages?.pages.flatMap(page =>
          (page?.threadResponseDtoList ?? []).map(dto =>
            mapServerThread(dto as any),
          ),
        ) ?? []
      ).sort(
        (a, b) =>
          new Date(b.createDatetime).getTime() -
          new Date(a.createDatetime).getTime(),
      ),
    [threadPages],
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  useEffect(() => {
    if (initialIds.length) {
      setSelectedIds(initialIds);
    }
  }, [initialIds]);

  const toggleSelect = useCallback((threadId: string) => {
    setSelectedIds(prev =>
      prev.includes(threadId)
        ? prev.filter(id => id !== threadId)
        : [...prev, threadId],
    );
  }, []);

  const selectedThreads = useMemo(
    () => threads.filter(t => selectedIds.includes(t.threadId)),
    [threads, selectedIds],
  );

  const { attach, loading: isAttaching } = useAttachThreadToHubThread();

  const handleConfirm = useCallback(async () => {
    if (!selectedIds.length) return;

    const hubThreadId = hubThreadIdFromParams;
    if (hubThreadId && member?.id) {
      const ok = await attach({
        currentMemberId: member.id,
        hubThreadId,
        threadIds: selectedIds,
        selectedThreads,
      });
      if (!ok) return;
    }

    route.params?.onConfirm?.(selectedThreads);
    navigation.goBack();
  }, [
    attach,
    hubThreadIdFromParams,
    member?.id,
    navigation,
    route.params,
    selectedIds,
    selectedThreads,
  ]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_ATTACH_MY_THREAD"
        isAtTop
        onBackPress={() => navigation.goBack()}
        right={
          <AppButton
            labelKey="STR_SAVE"
            onPress={handleConfirm}
            disabled={selectedIds.length === 0 || isAttaching}
            loading={isAttaching}
            style={styles.headerButton}
          />
        }
      />

      <View style={styles.selectedSection}>
        <View style={styles.selectedHeader}>
          <AppText variant="body" i18nKey="STR_SELECTED" />
          <AppText variant="body">({selectedThreads.length})</AppText>
        </View>
        <AppFlashList
          data={selectedThreads}
          keyExtractor={item => item.threadId}
          renderItem={({ item }) => (
            <SelectedThreadPreview
              thread={item}
              onRemove={() => toggleSelect(item.threadId)}
            />
          )}
          isHorizontal
          estimatedItemSize={120}
          ListEmptyComponent={
            <View style={styles.selectedEmpty}>
              <AppText variant="caption">No selection</AppText>
            </View>
          }
          contentContainerStyle={styles.selectedListContent}
          showsHorizontalScrollIndicator
        />
      </View>

      <AppFlashList
        data={threads}
        keyExtractor={item => item.threadId}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.threadId);
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => toggleSelect(item.threadId)}
              style={[
                styles.threadWrapper,
                isSelected && styles.threadWrapperSelected,
              ]}
            >
              <View pointerEvents="none">
                <ThreadItemDetail item={item} />
              </View>
              <View
                style={[
                  styles.checkBadge,
                  isSelected
                    ? styles.checkBadgeActive
                    : styles.checkBadgeInactive,
                ]}
              >
                <AppIcon
                  name={isSelected ? 'checkmark' : 'ellipse-outline'}
                  type="ion"
                  size={16}
                  variant="primary"
                />
              </View>
            </TouchableOpacity>
          );
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        isLoading={isLoading || isRefetching}
        loadingMore={isFetchingNextPage}
        ListEmptyComponent={
          !isLoading && !isRefetching ? (
            <View style={styles.emptyContainer}>
              <AppText variant="body" i18nKey="STR_NO_DATA" />
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AttachMyThreadModal;

type PreviewProps = {
  thread: Thread;
  onRemove: () => void;
};

const SelectedThreadPreview: React.FC<PreviewProps> = ({
  thread,
  onRemove,
}) => {
  const cover =
    thread.contentImageUrls?.[0] || thread.markerImageUrl || undefined;

  return (
    <View style={styles.selectedCardWrap}>
      {cover ? (
        <ImageBackground
          source={{ uri: cover }}
          resizeMode="cover"
          style={styles.previewCard}
          imageStyle={styles.previewImage}
        />
      ) : (
        <View style={[styles.previewCard, styles.previewFallback]}>
          <AppText
            variant="caption"
            numberOfLines={3}
            style={styles.previewText}
          >
            {thread.description || ''}
          </AppText>
        </View>
      )}
      <TouchableOpacity onPress={onRemove} style={styles.cardRemove}>
        <AppIcon name="close" type="ion" size={14} variant="primary" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerButton: {
    height: 32,
    paddingHorizontal: SPACING.md,
  },
  selectedSection: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    height: 250,
    paddingTop: 60,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  selectedListContent: {
    paddingVertical: SPACING.sm,
  },
  selectedChip: {
    display: 'none',
  },
  selectedText: {
    maxWidth: 180,
  },
  removeIcon: {
    marginLeft: SPACING.xs,
  },
  selectedCardWrap: {
    width: 120,
    height: 150,
    marginRight: SPACING.sm,
  },
  cardRemove: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    padding: SPACING.xs,
    backgroundColor: COLORS.overlay_dark,
    borderRadius: 999,
  },
  previewCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
  },
  previewImage: {
    borderRadius: 16,
  },
  previewFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  previewText: {
    textAlign: 'center',
  },
  selectedEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  threadWrapper: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  threadWrapperSelected: {
    borderWidth: 1,
    borderColor: COLORS.button_active,
    borderRadius: 12,
  },
  checkBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeActive: {
    backgroundColor: COLORS.overlay_light,
    borderWidth: 1,
    borderColor: COLORS.button_active,
  },
  checkBadgeInactive: {
    backgroundColor: COLORS.overlay_dark,
  },
  emptyContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xl * 2,
  },
});
