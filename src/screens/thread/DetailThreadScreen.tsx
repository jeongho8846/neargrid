import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Thread } from '../../features/thread/model/ThreadModel';
import ThreadCommentList from '@/features/thread/lists/ThreadCommentList';
import { COLORS } from '@/common/styles/colors';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';

type RouteParams = {
  DetailThread: { thread: Thread };
};

const DetailThreadScreen = () => {
  const { params } = useRoute<RouteProp<RouteParams, 'DetailThread'>>();
  const { thread } = params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_THREAD"
        isAtTop={false}
        onBackPress={() => navigation.goBack()}
      />
      <ThreadCommentList
        threadId={thread.threadId}
        headerThread={thread}
        style={{ flex: 1 }} // ✅ 추가!
      />
    </View>
  );
};

export default DetailThreadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 70,
  },
});
