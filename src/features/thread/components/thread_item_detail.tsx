// 📄 src/features/thread/components/thread_item_detail.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '@/common/components/AppText';
import AppImageCarousel from '@/common/components/AppImageCarousel';
import AppTextField from '@/common/components/AppTextField';
import AppIcon from '@/common/components/AppIcon';
import AppProfileImage from '@/common/components/AppProfileImage';
import { AppSkeletonPreset } from '@/common/components/Skeletons';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { Thread } from '../model/ThreadModel';
import ThreadActionBar from './ThreadActionBar';
import ContentsMenuButton from '@/common/components/Contents_Menu_Button';
import { openThreadMenuSheet } from '../sheets/openThreadMenuSheet';

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
    <View style={styles.container}>
      {/* 🧩 HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AppProfileImage
            imageUrl={item.memberProfileImageUrl}
            memberId={item.memberId}
            canGoToProfileScreen
            size={36}
          />

          <View style={styles.headerTextCol}>
            <AppText variant="username" isLoading={isLoading}>
              {item.memberNickName}
            </AppText>

            <View style={styles.dateRow}>
              <AppIcon
                type="ion"
                name="time-outline"
                size={12}
                variant="secondary"
              />
              <AppText variant="caption">{createdMMDD}</AppText>
            </View>
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
            style={{ color: COLORS.body }}
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
            {hasImages ? (
              <View style={styles.textBox}>
                <AppTextField text={item.description || ''} numberOfLines={3} />
              </View>
            ) : (
              <View style={styles.bubbleWrap}>
                <View style={[styles.bubbleTail, { left: SPACING.sm + 10 }]} />
                <View
                  style={[
                    styles.bubbleInner,
                    {
                      marginLeft: SPACING.sm,
                      padding: SPACING.md,
                    },
                  ]}
                >
                  <AppTextField
                    text={item.description || ''}
                    numberOfLines={6}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* ⚙️ ACTION BAR */}
          <ThreadActionBar threadId={item.threadId} isLoading={isLoading} />
        </>
      )}
    </View>
  );
};

export default ThreadItemDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
    paddingBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTextCol: { flexDirection: 'column', gap: 2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  touchArea: { flex: 1 },
  textBox: { paddingHorizontal: SPACING.sm, marginTop: SPACING.sm },
  bubbleWrap: { marginTop: SPACING.sm, position: 'relative' },
  bubbleInner: {
    backgroundColor: COLORS.text_bubble_background,
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
    borderRadius: 8,
    elevation: 2,
  },
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
  },
  hiddenBox: {
    backgroundColor: COLORS.sheet_background,
    borderRadius: 8,
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.sm,
    marginTop: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: COLORS.border,
  },
});
