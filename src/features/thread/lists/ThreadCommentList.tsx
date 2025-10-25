// src/features/thread/lists/ThreadCommentList.tsx
import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import ThreadCommentItem from '../components/ThreadComment_item_card';
import { fetchThreadComments } from '../api/fetchThreadComments';
import { ThreadComment } from '../model/ThreadCommentModel';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import AppText from '@/common/components/AppText';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';

export type ThreadCommentListRef = {
  addOptimisticComment: (comment: ThreadComment) => void;
  replaceTempComment: (tempId: string, newComment: ThreadComment) => void;
  removeTempComment: (tempId: string) => void;
};

const ThreadCommentList = forwardRef<
  ThreadCommentListRef,
  { threadId: string }
>(({ threadId }, ref) => {
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
  }, [loadComments]);

  useImperativeHandle(ref, () => ({
    addOptimisticComment: comment => {
      setComments(prev => [comment, ...prev]);
    },
    replaceTempComment: (tempId, newComment) => {
      setComments(prev =>
        prev.map(c => (c.commentThreadId === tempId ? newComment : c)),
      );
    },
    removeTempComment: tempId => {
      setComments(prev => prev.filter(c => c.commentThreadId !== tempId));
    },
  }));

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
});

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
    paddingBottom: 80,
  },
});

export default ThreadCommentList;
