import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppToggleIcon from '@/common/components/AppToggleIcon';
import { SPACING, COLORS } from '@/common/styles/tokens';

type Item = {
  id: string;
  author: string;
  media?: string | string[];
  caption?: string;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
};

type Props = {
  item: Item;
  showGiftButton?: boolean;
};

export default function ActionBar({ item, showGiftButton = true }: Props) {
  const [liked, setLiked] = useState(item.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(item.likeCount ?? 0);

  const handleToggleLike = () => {
    setLiked(prev => {
      const newLiked = !prev;
      setLikeCount(c => (newLiked ? c + 1 : Math.max(0, c - 1)));
      return newLiked;
    });
  };

  return (
    <View style={styles.container}>
      {/* 🩷 왼쪽 액션 그룹 */}
      <View style={styles.leftGroup}>
        {/* ❤️ Like */}
        <TouchableOpacity
          style={styles.action}
          activeOpacity={0.8}
          onPress={handleToggleLike}
        >
          <AppToggleIcon
            active={liked}
            onToggle={handleToggleLike}
            activeIcon="heart"
            inactiveIcon="heart-outline"
            activeColor={COLORS.error}
            inactiveColor={COLORS.text_primary}
            size={20}
          />
          <AppText variant="label">{likeCount}</AppText>
        </TouchableOpacity>

        {/* 💬 Comment */}
        <TouchableOpacity style={styles.action} activeOpacity={0.8}>
          <AppIcon
            name="chatbubble-outline"
            size={20}
            color={COLORS.text_primary}
          />
          <AppText variant="label">{item.commentCount ?? 0}</AppText>
        </TouchableOpacity>

        {/* 📤 Share */}
        <TouchableOpacity style={styles.action} activeOpacity={0.8}>
          <AppIcon name="share-outline" size={20} color={COLORS.text_primary} />
        </TouchableOpacity>
      </View>

      {/* 🎁 Gift (오른쪽 끝 정렬) */}
      {showGiftButton && (
        <TouchableOpacity style={styles.giftAction} activeOpacity={0.8}>
          <AppIcon name="gift-outline" size={22} color={COLORS.text_primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  giftAction: {
    marginLeft: 'auto',
  },
});
