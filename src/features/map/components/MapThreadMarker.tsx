// 📄 src/features/map/components/MapThreadMarker.tsx
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { COLORS } from '@/common/styles/colors';
import AppText from '@/common/components/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  latitude: number;
  longitude: number;
  imageUrl?: string; // 게시글 이미지
  profileImageUrl?: string; // 작성자 프로필 이미지
  reactionCount?: number; // ✅ 클러스터 수
  onPress?: () => void;
};

const MapThreadMarker = ({
  latitude,
  longitude,
  imageUrl,
  profileImageUrl,
  reactionCount,
  onPress,
}: Props) => {
  const [tracks, setTracks] = React.useState(true);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTracking = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTracks(false);
  }, []);

  React.useEffect(() => {
    setTracks(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => stopTracking(), 1000); // fallback to stop tracking
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [reactionCount, imageUrl, profileImageUrl, stopTracking]);

  const postImageUrl = imageUrl || undefined;
  const profileImage = profileImageUrl || undefined;
  const isCluster = typeof reactionCount === 'number' && reactionCount > 1;

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={10}
      tracksViewChanges={tracks}
      onPress={onPress}
    >
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          {postImageUrl ? (
            <Image
              source={{ uri: postImageUrl }}
              style={styles.image}
              onLoadEnd={stopTracking}
            />
          ) : profileImage ? (
            <View style={styles.profileWithBubble}>
              <Image
                source={{ uri: profileImage }}
                style={[styles.image, styles.profileImage]}
                onLoadEnd={stopTracking}
              />
              <Ionicons
                name="chatbubble"
                size={20}
                color="white"
                style={[
                  styles.bubbleIcon,
                  { transform: [{ scaleX: -1 }] }, // ← 좌우 반전
                ]}
              />
            </View>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {isCluster && (
          <View style={styles.badgeContainer}>
            <AppText variant="body" style={styles.badgeText}>
              {reactionCount && reactionCount > 99 ? '99+' : reactionCount}
            </AppText>
          </View>
        )}
      </View>
    </Marker>
  );
};

export default MapThreadMarker;

const styles = StyleSheet.create({
  container: {
    width: 60, // ✅ 이미지보다 큰 투명 영역
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#11111102',
    overflow: 'visible',
  },
  imageWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible', // allow bubble to render outside
    backgroundColor: '#11111102',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  profileImage: {
    borderRadius: 30,
  },
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.button_surface,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0, // ✅ 이미지 밖으로 자연스럽게
    right: 0,
    backgroundColor: COLORS.button_surface,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.button_surface,
  },
  badgeText: { textAlign: 'center', justifyContent: 'center' },

  profileWithBubble: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },

  bubbleIcon: {
    position: 'absolute',
    left: 2,
    top: 2,
  },
});
