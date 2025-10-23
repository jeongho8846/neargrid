import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import ThreadCommentItem from '../components/ThreadComment_item_card';
import { fetchThreadComments } from '../api/fetchThreadComments';
import { ThreadComment } from '../model/ThreadCommentModel';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import AppText from '@/common/components/AppText';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';

type Props = { threadId: string };

const ThreadCommentList: React.FC<Props> = ({ threadId }) => {
  const { member } = useCurrentMember();
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!member) return;
      try {
        const res = await fetchThreadComments({
          threadId,
          currentMemberId: member.id,
        });
        setComments(res.commentThreadResponseDtos || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [threadId, member]);

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
    paddingBottom: 80,
  },
});

export default ThreadCommentList;
