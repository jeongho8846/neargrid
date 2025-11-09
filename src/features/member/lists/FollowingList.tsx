// 📄 src/features/member/lists/FollowingList.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';

type FollowingListProps = {
  targetId: string;
};

type FollowingItem = {
  id: string;
  nickname: string;
  profileImageUrl?: string;
};

const FollowingList: React.FC<FollowingListProps> = ({ targetId }) => {
  console.log('📜 [FollowingList] targetId:', targetId);

  // TODO: 나중에 API 연동으로 교체
  const dummyData: FollowingItem[] = [
    { id: '1', nickname: 'jeongho', profileImageUrl: undefined },
    { id: '2', nickname: 'namtaeho', profileImageUrl: undefined },
    { id: '3', nickname: 'papaya_user', profileImageUrl: undefined },
  ];

  return (
    <BottomSheetFlatList
      data={dummyData}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <AppProfileImage imageUrl={item.profileImageUrl} size={36} />
          <AppText variant="body" style={styles.nickname}>
            {item.nickname}
          </AppText>
        </View>
      )}
    />
  );
};

export default FollowingList;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.line_light,
  },
  nickname: {
    marginLeft: SPACING.sm,
  },
});
