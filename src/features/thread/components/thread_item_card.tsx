import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AppText from '@/common/components/AppText';
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
 * - FlatList의 numColumns로 자동 1/3 크기 계산
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
          <View style={styles.overlay}>
            <View style={styles.profileRow}>
              {thread.memberProfileImageUrl ? (
                <Image
                  source={{ uri: thread.memberProfileImageUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profilePlaceholder} />
              )}
              <AppText variant="username">
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
    flex: 1, // ✅ numColumns=3일 때 자동 1/3 비율 차지
    aspectRatio: 0.75, // ✅ 정사각형 유지
    borderRadius: 16,
    overflow: 'hidden',
    padding: SPACING.xs,
  },
  contentsBox: { flex: 1, backgroundColor: COLORS.border, borderRadius: 16 },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: 16,
  },
  overlay: {
    backgroundColor: COLORS.overlay_dark,
    padding: SPACING.sm,
    borderRadius: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: SPACING.sm,
  },
  profilePlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    marginRight: SPACING.sm,
  },
});
