import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppCard from '@/common/components/AppCard';
import AppAvatar from '@/common/components/AppAvatar';
import AppText from '@/common/components/AppText';
import AppImage from '@/common/components/AppImage';
import AppDivider from '@/common/components/AppDivider';
import AppButton from '@/common/components/AppButton';
import AppCarousel from '@/common/components/AppCarousel';
import AppReadMoreBox from '@/common/components/AppReadMoreBox';
import { SPACING } from '@/common/styles/tokens';
import ActionBar from './actionBar';

type Props = {
  item: {
    id: string;
    author: string;
    media?: string | string[];
    caption?: string;
  };
};

export default function ThreadItemDetail({ item }: Props) {
  const hasMedia =
    !!item.media && (Array.isArray(item.media) ? item.media.length > 0 : true);
  const hasCaption = !!item.caption;

  return (
    <AppCard style={styles.card}>
      {/* 🧩 Header */}
      <View style={styles.header}>
        <View style={styles.profileBox}>
          <AppAvatar />
        </View>

        <View style={styles.nameBox}>
          <AppText variant="nickname">{item.author}</AppText>
        </View>

        <View style={styles.optionBox}>
          <AppButton
            variant="ghost"
            icon="ellipsis-vertical"
            onPress={() => console.log('옵션 버튼 클릭')}
          />
        </View>
      </View>

      {/* 🧩 Body */}
      <View style={styles.body}>
        {hasMedia &&
          (Array.isArray(item.media) ? (
            <AppCarousel images={item.media} height={300} />
          ) : (
            <AppImage source={{ uri: item.media }} variant="card" />
          ))}

        {hasCaption && (
          <View style={styles.captionBox}>
            <AppReadMoreBox numberOfLines={3}>{item.caption}</AppReadMoreBox>
          </View>
        )}
      </View>

      {/* 🧩 Footer */}
      <View style={styles.footer}>
        <ActionBar item={item} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    height: 50,
    gap: 10,
  },
  profileBox: {
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  nameBox: {
    justifyContent: 'center',
  },
  optionBox: {
    padding: SPACING.xs,
    alignContent: 'flex-end',
    marginLeft: 'auto',
    width: 50,
  },
  body: {
    marginBottom: SPACING.sm,
  },
  captionBox: {
    marginTop: SPACING.xs,
  },
  footer: {
    marginTop: SPACING.sm,
  },
});
