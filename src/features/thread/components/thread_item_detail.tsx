// 📄 src/features/thread/components/thread_item_detail.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '@/common/components/AppText';
import AppImageCarousel from '@/common/components/AppImageCarousel';
import AppTextField from '@/common/components/AppTextField';
import AppProfileImage from '@/common/components/AppProfileImage';
import { AppSkeletonPreset } from '@/common/components/Skeletons';
import { Thread } from '../model/ThreadModel';
import ThreadActionBar from './ThreadActionBar';
import ContentsMenuButton from '@/common/components/Contents_Menu_Button';
import { openThreadMenuSheet } from '../sheets/openThreadMenuSheet';
import { openThreadEditorListSheet } from '../sheets/openThreadEditorListSheet';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';

type Props = {
  item: Thread;
  isLoading?: boolean;
  hubThreadId?: string;
};

const ThreadItemDetail: React.FC<Props> = ({
  item,
  isLoading = false,
  hubThreadId,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  if (isLoading) return <AppSkeletonPreset type="detail" />;

  const editMembers = item.editMemberResponseSimpleDtos ?? [];
  const displayedEditMembers = editMembers.slice(0, 3);
  const showEditingCount = editMembers.length > 3;

  const hasImages = (item.contentImageUrls?.length ?? 0) > 0;
  const createdMMDD = item.createDatetime
    ? item.createDatetime.slice(5, 10)
    : '';
  const handleOpenEditMemberSheet = () =>
    openThreadEditorListSheet({
      members: editMembers,
      threadOwnerId: item.memberId,
      threadId: item.threadId,
    });

  const handlePress = () => {
    if (route.name === 'DetailThread') return;
    navigation.navigate('DetailThread', { thread: item });
  };

  console.log('쓰레드아이템디테일오는값', item);
  return (
    <View style={styles.card}>
      {/* 🧩 HEADER */}
      <View style={styles.header}>
        <View style={styles.row}>
          <AppProfileImage
            size={36}
            imageUrl={item.memberProfileImageUrl}
            memberId={item.memberId}
            canGoToProfileScreen={true}
          />
          <View style={styles.userInfo}>
            <AppText variant="username">{item.memberNickName}</AppText>
            <AppText variant="caption">{createdMMDD}</AppText>
          </View>
        </View>
        <ContentsMenuButton
          onOpen={() => openThreadMenuSheet({ thread: item, hubThreadId })}
        />
      </View>

      {/* 🚫 숨김 처리 */}
      {!item.available ? (
        <View style={styles.hiddenBox}>
          <AppText
            variant="body"
            style={{ color: TEST_COLORS.text_secondary }}
            i18nKey="STR_THREAD_HIDDEN_CONTENT"
          />
        </View>
      ) : (
        <>
          {/* 🖼️ IMAGE */}
          {hasImages && (
            <AppImageCarousel
              images={item.contentImageUrls!}
              height={300}
              isLoading={false}
            />
          )}

          {/* 💬 CONTENT */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            style={styles.touchArea}
          >
            <View style={styles.textBox}>
              <AppTextField
                text={item.description || ''}
                numberOfLines={hasImages ? 3 : 6}
              />
            </View>
            {editMembers.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.editMemberList}
                onPress={handleOpenEditMemberSheet}
              >
                <View style={styles.editorRow}>
                  {displayedEditMembers.map((member, index) => (
                    <View
                      key={member.id ?? index}
                      style={[
                        styles.editorAvatar,
                        index > 0 && styles.editorAvatarOverlap,
                      ]}
                    >
                      <AppProfileImage
                        size={30}
                        imageUrl={member.profileImageUrl}
                        memberId={member.id}
                        canGoToProfileScreen={true}
                      />
                    </View>
                  ))}

                  <>
                    <AppText variant="caption" style={styles.editorCount}>
                      {editMembers.length}
                    </AppText>
                    <AppText
                      variant="caption"
                      i18nKey="STR_THREAD_EDITING_LABEL"
                      style={styles.editorLabel}
                    />
                  </>
                </View>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* ⚙️ ACTION BAR */}
          <View style={styles.footer}>
            <ThreadActionBar
              threadId={item.threadId}
              thread={item} // ✅ thread 객체 전달
              isLoading={isLoading}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default ThreadItemDetail;
/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  card: {
    backgroundColor: TEST_COLORS.surface,
    borderRadius: TEST_RADIUS.md,
    overflow: 'hidden',
    marginBottom: TEST_SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: TEST_SPACING.md,
    paddingVertical: TEST_SPACING.md,
  },
  userInfo: {
    marginLeft: TEST_SPACING.sm,
  },

  footer: {
    paddingHorizontal: TEST_SPACING.sm,
  },
  editorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: TEST_SPACING.xs,
  },
  editorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEST_COLORS.surface,
  },
  editorAvatarOverlap: {
    marginLeft: -5,
  },
  editorCount: {
    marginLeft: TEST_SPACING.sm,
    color: TEST_COLORS.text_secondary,
  },
  editorLabel: {
    marginLeft: 2,
    color: TEST_COLORS.text_secondary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  middle: {
    backgroundColor: TEST_COLORS.surface, // ✅ 배경 통일
  },
  imagePlaceholder: {
    width: '100%',
    height: 400, // ✅ 조금 낮춰서 피드에 밀도감
    backgroundColor: TEST_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: TEST_COLORS.border,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: TEST_SPACING.sm,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    marginLeft: 4,
    color: TEST_COLORS.text_secondary,
    fontSize: 13,
  },
  touchArea: {
    flex: 1,
    paddingTop: TEST_SPACING.md,
    paddingHorizontal: TEST_SPACING.md,
  },
  textBox: { paddingHorizontal: TEST_SPACING.sm },
  editMemberList: {
    paddingHorizontal: TEST_SPACING.sm,
    marginTop: TEST_SPACING.sm,
  },
  hiddenBox: {
    backgroundColor: TEST_COLORS.surface,
    borderRadius: 8,
    paddingVertical: TEST_SPACING.lg,
    marginHorizontal: TEST_SPACING.sm,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderColor: TEST_COLORS.border,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
