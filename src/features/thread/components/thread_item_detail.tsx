import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import AppImageCarousel from '@/common/components/AppImageCarousel';
import AppTextField from '@/common/components/AppTextField';
import AppIcon from '@/common/components/AppIcon';
import AppProfileImage from '@/common/components/AppProfileImage';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';
import { Thread } from '../model/ThreadModel';
import ThreadActionBar from '../components/ThreadActionBar';

// ✅ 공용 ⋯ 버튼 (전역 바텀시트만 오픈)
import ContentsMenuButton from '@/common/components/Contents_Menu_Button';
import { openThreadMenuSheet } from '../sheets/openThreadMenuSheet';
// ...imports 동일

// ✅ 빠졌던 Props 타입 복구
type Props = {
  item: Thread;
  onPress?: (id: string) => void;
  isLoading?: boolean;
};

const ThreadItemDetail: React.FC<Props> = ({
  item,
  onPress,
  isLoading = false,
}) => {
  const hasImages = (item.contentImageUrls?.length ?? 0) > 0;
  const createdMMDD =
    !isLoading && item.createDatetime ? item.createDatetime.slice(5, 10) : '';

  const CONTENT_INSET = SPACING.sm;
  const BUBBLE_PADDING = SPACING.md;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {isLoading ? (
            // ✅ 프로필 이미지 스켈레톤 (동그라미)
            <View style={styles.profileSkeleton} />
          ) : (
            <AppProfileImage
              imageUrl={item.memberProfileImageUrl}
              memberId={item.memberId}
              canGoToProfileScreen
              size={36}
            />
          )}

          <View style={styles.headerTextCol}>
            <AppText style={styles.nickName} isLoading={isLoading}>
              {item.memberNickName}
            </AppText>
            <View style={styles.dateRow}>
              {!isLoading && (
                <AppIcon
                  type="ion"
                  name="time-outline"
                  size={12}
                  color={COLORS.text_secondary}
                />
              )}
              <AppText style={styles.dateText} isLoading={isLoading}>
                {createdMMDD}
              </AppText>
            </View>
          </View>
        </View>

        {/* 우측 버튼: 로딩 중엔 숨김 */}
        <View style={styles.headerRight}>
          {!isLoading && (
            <ContentsMenuButton
              onOpen={() => openThreadMenuSheet({ thread: item })}
            />
          )}
        </View>
      </View>

      {/* 이미지 영역 */}
      {isLoading ? (
        // ✅ 항상 “이미지박스” 스켈레톤 보이게
        <View style={styles.imageSkeleton} />
      ) : hasImages ? (
        <AppImageCarousel
          images={item.contentImageUrls!}
          height={300}
          isLoading={false}
        />
      ) : null}

      {/* 본문 (터치로 상세 이동) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress?.(item.threadId)}
        style={styles.touchArea}
        disabled={isLoading}
      >
        {isLoading ? (
          // ✅ 텍스트 2줄 스켈레톤
          <View style={styles.textBox}>
            <AppTextField text="" numberOfLines={2} isLoading />
          </View>
        ) : hasImages ? (
          <View style={styles.textBox}>
            <AppTextField text={item.description || ''} numberOfLines={3} />
          </View>
        ) : (
          // 실제 데이터 있을 때만 말풍선
          <View style={styles.bubbleWrap}>
            <View style={[styles.bubbleTail, { left: CONTENT_INSET + 10 }]} />
            <View
              style={[
                styles.bubbleInner,
                {
                  marginLeft: CONTENT_INSET,
                  paddingLeft: BUBBLE_PADDING,
                  paddingRight: BUBBLE_PADDING,
                  paddingVertical: BUBBLE_PADDING,
                },
              ]}
            >
              <View style={styles.bubbleContent}>
                <AppTextField text={item.description || ''} numberOfLines={6} />
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* 액션바: 로딩 중엔 비활성/스켈레톤 */}

      <ThreadActionBar thread={item} isLoading={isLoading} />
    </View>
  );
};
export default ThreadItemDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
    borderBottomWidth: 0,
    paddingBottom: SPACING.md,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 8,
  },
  headerTextCol: { flexDirection: 'column', gap: 2 },
  nickName: { ...FONT.body, color: COLORS.text },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { ...FONT.caption, color: COLORS.text_secondary },

  touchArea: { flex: 1 },

  textBox: {
    width: '100%',
    paddingHorizontal: SPACING.sm,
    marginTop: SPACING.sm,
  },

  // ✅ 스켈레톤 전용 스타일
  profileSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.skeleton_bone_light,
  },
  imageSkeleton: {
    height: 250,
    marginTop: SPACING.xs,
    marginHorizontal: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.skeleton_bone_light,
  },

  // 말풍선 (데이터 있을 때만)
  bubbleWrap: {
    marginTop: SPACING.sm,
    position: 'relative',
    alignItems: 'flex-start',
  },
  bubbleInner: {
    backgroundColor: COLORS.text_bubble_background,
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    zIndex: 3,
    marginHorizontal: SPACING.sm,
    alignSelf: 'flex-start',
    flexShrink: 1,
    maxWidth: '100%',
  },
  bubbleContent: { flexShrink: 1 },
  bubbleTail: {
    position: 'absolute',
    top: -7,
    width: 15,
    height: 15,
    backgroundColor: COLORS.text_bubble_background,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: COLORS.text_bubble_border,
    transform: [{ rotate: '45deg' }],
    zIndex: 2,
    elevation: 3,
  },
});
