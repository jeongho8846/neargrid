import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { apiContents } from '@/services/apiService';
import MemberItemLabel from '../components/MemberItemLabel';

type Following = {
  id: string;
  nickName: string;
  profileImageUrl?: string | null;
};

export const openFollowingListSheet = ({
  targetId,
  currentMemberId,
}: {
  targetId: string;
  currentMemberId: string;
}) => {
  const { open } = useBottomSheetStore.getState();

  open(
    <FollowingListSheetContent
      targetId={targetId}
      currentMemberId={currentMemberId}
    />,
    {
      snapPoints: ['90%'],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
    },
  );
};

const FollowingListSheetContent: React.FC<{
  targetId: string;
  currentMemberId: string;
}> = ({ targetId, currentMemberId }) => {
  const [followings, setFollowings] = useState<Following[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<any>();
  const { close } = useBottomSheetStore();

  useEffect(() => {
    fetchFollowings();
  }, []);

  const fetchFollowings = async () => {
    console.log('📡 [FollowingListSheet] API 호출 시작');
    console.log('🧩 params:', {
      member_id: targetId,
      current_member_id: currentMemberId,
    });

    try {
      setLoading(true);
      const res = await apiContents.get('/follow/getFollowingMembers', {
        params: {
          member_id: targetId,
          current_member_id: currentMemberId,
        },
      });

      console.log('✅ [FollowingListSheet] API 응답 수신');
      console.log('🔹 status:', res.status);
      console.log(
        '🔹 data length:',
        Array.isArray(res.data) ? res.data.length : 0,
      );
      console.log('🧾 data sample:', res.data?.[0] ?? '(empty)');

      setFollowings(res.data ?? []);
    } catch (err: any) {
      console.error(
        '❌ [FollowingListSheet] fetch error:',
        err?.message ?? err,
      );
    } finally {
      setLoading(false);
      console.log('🏁 [FollowingListSheet] API 호출 완료');
    }
  };

  /** ✅ 아이템 클릭 → 시트 닫고 프로필로 이동 */
  const handlePressMember = (memberId: string) => {
    close(); // 바텀시트 닫기
    navigation.navigate('Profile', { memberId }); // 프로필로 이동
  };

  const renderItem = ({ item }: { item: Following }) => (
    <MemberItemLabel
      item={{
        id: item.id,
        nickname: item.nickName,
        profileImageUrl: item.profileImageUrl,
        onPress: () => handlePressMember(item.id),
      }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <AppText
        i18nKey="STR_FOLLOWINGS"
        variant="caption"
        style={styles.title}
        isLoading={loading}
      />
      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        data={followings}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && (
            <AppText
              i18nKey="STR_FOLLOWING_EMPTY"
              variant="caption"
              style={styles.empty}
            />
          )
        }
      />
    </View>
  );
};

export default FollowingListSheetContent;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.body,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
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
});
