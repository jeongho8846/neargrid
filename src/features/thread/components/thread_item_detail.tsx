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
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';

type Props = {
  item: Thread;
  isLoading?: boolean;
};

const ThreadItemDetail: React.FC<Props> = ({ item, isLoading = false }) => {
  const navigation = useNavigation();
  const route = useRoute();

  if (isLoading) return <AppSkeletonPreset type="detail" />;

  const hasImages = (item.contentImageUrls?.length ?? 0) > 0;
  const createdMMDD = item.createDatetime
    ? item.createDatetime.slice(5, 10)
    : '';

  const handlePress = () => {
    if (route.name === 'DetailThread') return;
    navigation.navigate('DetailThread', { thread: item });
  };

  return (
    <View style={styles.card}>
      {/* 🧩 HEADER */}
      <View style={styles.header}>
        <View style={styles.row}>
          <AppProfileImage size={36} imageUrl={item.memberProfileImageUrl} />
          <View style={styles.userInfo}>
            <AppText variant="username">{item.memberNickName}</AppText>
            <AppText variant="caption">{createdMMDD}</AppText>
          </View>
        </View>
        <ContentsMenuButton
          onOpen={() => openThreadMenuSheet({ thread: item })}
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
