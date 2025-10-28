// src/features/thread/screens/DetailThreadCommentScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { COLORS } from '@/common/styles/colors';
import { ThreadComment } from '@/features/thread/model/ThreadCommentModel';
import ThreadReplyList from '@/features/thread/lists/ThreadCommnetReplyList';

type RouteParams = {
  DetailThreadComment: {
    comment: ThreadComment;
  };
};

const DetailThreadCommentScreen = () => {
  const { params } = useRoute<RouteProp<RouteParams, 'DetailThreadComment'>>();
  const { comment } = params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_COMMENT"
        isAtTop={false}
        onBackPress={() => navigation.goBack()}
      />
      <ThreadReplyList parentComment={comment} />
    </View>
  );
};

export default DetailThreadCommentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
