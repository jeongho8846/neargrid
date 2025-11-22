// 📄 src/features/thread/screens/DetailThreadCommentScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { COLORS } from '@/common/styles/colors';
import type { ThreadComment } from '@/features/thread/model/ThreadCommentModel'; // ✅ 타입 import로 변경
import ThreadCommentReplyList from '@/features/thread/lists/ThreadCommnetReplyList'; // ✅ 오타 수정
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';

type RouteParams = {
  DetailThreadComment: {
    comment: ThreadComment;
  };
};

/**
 * ✅ DetailThreadCommentScreen
 * - 부모 댓글 + 대댓글 목록 표시
 * - 입력창은 ThreadCommentReplyList 내부에서 관리
 */
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
      <ThreadCommentReplyList parentComment={comment} />
      <BottomBlurGradient height={120}></BottomBlurGradient>
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
