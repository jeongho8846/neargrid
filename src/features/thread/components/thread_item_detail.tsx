import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import AppImageCarousel from '@/common/components/AppImageCarousel';
import AppTextField from '@/common/components/AppTextField';
import AppIcon from '@/common/components/AppIcon';
import AppProfileImage from '@/common/components/AppProfileImage'; // ✅ 추가
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';
import { Thread } from '../model/ThreadModel';

type Props = {
  item: Thread;
  onPress?: (id: string) => void;
  /** ✅ 로딩 스켈레톤 표시 여부 */
  isLoading?: boolean;
};

const ThreadItemDetail: React.FC<Props> = ({
  item,
  onPress,
  isLoading = false,
}) => {
  return (
    <View style={styles.container}>
      {/* ✅ 작성자 정보 */}
      <View style={styles.header}>
        <AppProfileImage
          imageUrl={item.memberProfileImageUrl}
          memberId={item.memberId}
          canGoToProfileScreen
          size={36}
        />
        <AppText style={styles.nickName} isLoading={isLoading}>
          {item.memberNickName}
        </AppText>
      </View>

      {/* ✅ 이미지 캐러셀 (터치 독립 영역) */}
      <AppImageCarousel
        images={item.contentImageUrls || []}
        height={300}
        isLoading={isLoading}
      />

      {/* ✅ 본문 + 메타정보 (터치 가능 영역) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress?.(item.threadId)}
        style={styles.touchArea}
      >
        <View style={styles.textBox}>
          <AppTextField
            text={item.description || ''}
            numberOfLines={3}
            isLoading={isLoading}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <AppIcon
              type="ion"
              name="location-outline"
              size={14}
              color={COLORS.text_secondary}
            />
            <AppText style={styles.metaText} isLoading={isLoading}>
              {!isLoading &&
                `${Math.round(item.distanceFromCurrentMember / 1000)}km`}
            </AppText>
          </View>
          <View style={styles.metaRow}>
            <AppIcon
              type="ion"
              name="time-outline"
              size={14}
              color={COLORS.text_secondary}
            />
            <AppText style={styles.metaText} isLoading={isLoading}>
              {!isLoading && item.createDatetime?.slice(0, 10)}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ThreadItemDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  profileImage: {
    width: 36,
    height: 36,
  },
  nickName: {
    ...FONT.body,
    color: COLORS.text,
  },
  touchArea: {
    flex: 1,
  },
  textBox: {
    width: '100%',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...FONT.caption,
    color: COLORS.text_secondary,
  },
});
