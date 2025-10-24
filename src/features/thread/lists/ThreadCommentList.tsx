import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import ThreadCommentItem from '../components/ThreadComment_item_card';
import { fetchThreadComments } from '../api/fetchThreadComments';
import { ThreadComment } from '../model/ThreadCommentModel';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import AppText from '@/common/components/AppText';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';

type Props = {
  threadId: string;
  /** ✅ 외부에서 강제로 새로고침할 때 refetchTrigger 변경 */
  refetchTrigger?: number;
};

const ThreadCommentList: React.FC<Props> = ({ threadId, refetchTrigger }) => {
  const { member } = useCurrentMember();
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async () => {
    if (!member) return;
    try {
      setLoading(true);
      const res = await fetchThreadComments({
        threadId,
        currentMemberId: member.id,
      });
      setComments(res.commentThreadResponseDtos || []);
    } finally {
      setLoading(false);
    }
  }, [threadId, member]);

  useEffect(() => {
    loadComments();
  }, [loadComments, refetchTrigger]);

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );

  if (!comments.length)
    return (
      <View style={styles.empty}>
        <AppText>아직 댓글이 없습니다.</AppText>
      </View>
    );

  return (
    <AppFlatList
      data={comments}
      keyExtractor={item => item.commentThreadId}
      renderItem={({ item }) => <ThreadCommentItem comment={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  listContent: {
    paddingBottom: 80, // 인풋바 높이 확보
  },
});

export default ThreadCommentList;
