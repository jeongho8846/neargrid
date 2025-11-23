// 📄 src/features/thread/lists/RouteThread_ChildThreadList.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ThreadItemDetail from '../components/thread_item_detail';
import { Thread } from '../model/ThreadModel';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useReadRouteThreadChildThreads } from '../hooks/useReadRouteThreadChildThreads';
import AppText from '@/common/components/AppText';
import AppFlashList from '@/common/components/AppFlashList/AppFlashList';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';

type Props = {
  threadId: string;
  headerThread?: Thread | null;
  style?: object;
};

/**
 * ✅ RouteThread_ChildThreadList
 * - ROUTE_THREAD의 자식 스레드(GENERAL_THREAD) 리스트
 * - API: /thread/readThreadDetail (read_thread_type: CHILD_THREAD)
 * - 각 자식 스레드 클릭 시 DetailThreadScreen으로 이동
 */
const RouteThread_ChildThreadList: React.FC<Props> = ({
  threadId,
  headerThread,
  style,
}) => {
  const navigation = useNavigation();
  const { member } = useCurrentMember();

  // ✅ 자식 스레드 목록 조회
  const {
    data: childThreads = [],
    isLoading,
    refetch,
    isFetching,
  } = useReadRouteThreadChildThreads(threadId, member?.id);

  const isEmpty = !isLoading && childThreads.length === 0;

  // ✅ headerThread에서 childThreadCount 가져오기
  const displayCount =
    headerThread?.childThreadDirectCount ?? childThreads.length;

  const handleThreadPress = (thread: Thread) => {
    navigation.navigate('DetailThread', { thread });
  };

  return (
    <View style={styles.container}>
      <AppFlashList
        data={childThreads}
        style={style}
        keyExtractor={item => item.threadId}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleThreadPress(item)}
          >
            <ThreadItemDetail item={item} />
          </TouchableOpacity>
        )}
        isLoading={isLoading}
        refreshing={isFetching}
        onRefresh={refetch}
        renderSkeletonItem={({ index }) => (
          <ThreadItemDetail
            item={{
              threadId: `skeleton-${index}`,
              threadType: 'GENERAL_THREAD',
              description: '',
              memberNickName: '',
              memberProfileImageUrl: '',
              markerImageUrl: '',
              contentImageUrls: [],
              videoUrls: [],
              reactionCount: 0,
              commentThreadCount: 0,
              createDatetime: '',
              updateDatetime: '',
              distanceFromCurrentMember: 0,
              popularityScore: 0,
              popularityScoreRecent: 0,
              latitude: 0,
              longitude: 0,
              reactedByCurrentMember: false,
              available: true,
              private: false,
              hiddenDueToReport: false,
              bountyPoint: null,
              expireDateTime: null,
              remainDateTime: null,
              childThreadCount: 0,
              childThreadDirectCount: 0,
              childThreadWritableByOthers: false,
              donationPointReceivedCount: 0,
              memberId: '',
            }}
          />
        )}
        skeletonCount={3}
        ListHeaderComponent={
          headerThread ? (
            <View>
              <ThreadItemDetail item={headerThread} />
              <View style={styles.headerDivider}>
                {/* ✅ 자식 스레드 개수 표시 */}
                <AppText i18nKey="STR_CHILD_THREAD_COUNT" variant="body" />
                <AppText variant="body">{displayCount}</AppText>
              </View>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isEmpty ? (
            <View style={styles.empty}>
              <AppText i18nKey="STR_EMPTY_CHILD_THREAD" variant="body" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default RouteThread_ChildThreadList;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56 },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: SPACING.xl,
  },
  listContent: { paddingBottom: SPACING.xl * 3 },
  headerDivider: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
});
