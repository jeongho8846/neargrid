import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppProfileImage from '@/common/components/AppProfileImage';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import type { MapThreadMarkerData } from '@/features/map/hooks/useFetchMapThreads';

type Props = {
  thread: MapThreadMarkerData;
  onPress?: () => void;
};

/**
 * ✅ ThreadItemCard
 * - 지도/리스트 공용 카드 UI
 * - 좋아요/댓글 + threadType을 우측 상단에 표시
 */
const ThreadItemCard: React.FC<Props> = ({ thread, onPress }) => {
  const background =
    thread.contentImageUrls?.[0] ||
    thread.markerImageUrl ||
    thread.memberProfileImageUrl;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.contentsBox}>
        <ImageBackground
          source={{ uri: background }}
          resizeMode="cover"
          style={styles.backgroundImage}
          imageStyle={styles.imageRadius}
        >
          {/* ❤️ 좋아요/댓글 + threadType 묶음 — 카드 우측 상단 */}
          <View style={styles.topRightContainer}>
            {/* 상단: 좋아요 / 댓글 */}
            <View style={styles.topRightBox}>
              <View style={styles.statGroup}>
                <AppIcon name="heart" type="ion" size={11} variant="onDark" />
                <AppText variant="body" style={styles.statText}>
                  {thread.reactionCount ?? 0}
                </AppText>
              </View>

              <View style={styles.statGroup}>
                <AppIcon
                  name="chatbubble"
                  type="ion"
                  size={10}
                  variant="onDark"
                />
                <AppText variant="body" style={styles.statText}>
                  {thread.commentCount ?? 0}
                </AppText>
              </View>
            </View>

            {/* 하단: 쓰레드 타입 */}
            <View style={styles.threadTypeBox}>
              <AppText
                variant="caption_bold"
                threadType={thread.threadType as keyof typeof COLORS}
                style={styles.statText}
              />
            </View>
          </View>

          {/* 👤 하단 오버레이 - 프로필 */}
          <View style={styles.overlay}>
            <View style={styles.profileRow}>
              <AppProfileImage
                imageUrl={thread.memberProfileImageUrl}
                size={28}
              />
              <AppText variant="username" style={styles.username}>
                {thread.memberNickName ?? 'Unknown'}
              </AppText>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default ThreadItemCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 16,
    overflow: 'hidden',
    padding: SPACING.xs,
  },
  contentsBox: {
    flex: 1,
    backgroundColor: COLORS.border,
    borderRadius: 16,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: 16,
  },

  /** 👇 하단 프로필 오버레이 */
  overlay: {
    backgroundColor: COLORS.overlay_dark,
    padding: SPACING.xs,
    borderRadius: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginLeft: SPACING.sm,
  },

  /** ⭐ 우측 상단 전체 묶음 */
  topRightContainer: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    alignItems: 'flex-end',
  },

  /** ❤️ 좋아요/댓글 반투명 박스 */
  topRightBox: {
    flexDirection: 'row',
    alignContent: 'space-between',
    backgroundColor: COLORS.overlay_strong,
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: SPACING.xs, // ✅ threadType 박스와 간격
    gap: SPACING.sm,
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 3,
    fontSize: 10,
  },

  /** 🧩 threadType 박스 */
  threadTypeBox: {
    backgroundColor: COLORS.overlay_strong,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
});
