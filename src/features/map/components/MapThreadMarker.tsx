// 📄 src/features/map/components/MapThreadMarker.tsx
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { COLORS } from '@/common/styles/colors';

type Props = {
  latitude: number;
  longitude: number;
  imageUrl?: string;
  reactionCount?: number;
  onPress?: () => void;
};

/**
 * ✅ MapThreadMarker (Fabric-safe 버전)
 * - TouchableOpacity 제거
 * - overflow/shadow 제거
 * - RN Image 사용
 */
const MapThreadMarker = ({ latitude, longitude, imageUrl, onPress }: Props) => {
  const decodedUrl = imageUrl ? decodeURIComponent(imageUrl) : undefined;

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={10}
      tracksViewChanges={true}
      onPress={onPress}
    >
      <View style={styles.container}>
        {/* ✅ 이미지 */}
        {decodedUrl ? (
          <Image
            source={{ uri: decodedUrl }}
            style={styles.image}
            resizeMode="cover"
            onLoadStart={() =>
              console.log('🟡 [Marker Image] load start', decodedUrl)
            }
            onLoad={() =>
              console.log('✅ [Marker Image] load success', decodedUrl)
            }
            onError={e =>
              console.log('❌ [Marker Image] load error', e.nativeEvent)
            }
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </Marker>
  );
};

export default MapThreadMarker;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.button_active,
  },
  badge: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.surface,
    alignSelf: 'center',
  },
});
