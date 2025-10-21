// src/features/thread/sheets/openThreadMenuSheet.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { Thread } from '../model/ThreadModel';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';

export const openThreadMenuSheet = ({ thread }: { thread: Thread }) => {
  const { open, close } = useBottomSheetStore.getState();

  console.log('openThreadMenuSheet thread=', thread);
  const Row = ({
    icon,
    label,
    danger,
    onPress,
  }: {
    icon: string;
    label: string;
    danger?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => {
        try {
          onPress?.();
        } finally {
          close();
        }
      }}
    >
      <AppIcon
        type="ion"
        name={icon}
        size={18}
        color={danger ? COLORS.danger : COLORS.text}
      />
      <AppText style={[styles.rowText, danger && { color: COLORS.danger }]}>
        {label}
      </AppText>
    </TouchableOpacity>
  );

  const isMyThread = false;

  open(
    <View style={styles.wrap}>
      <View style={styles.group}>
        <Row
          icon="share-outline"
          label="공유하기"
          onPress={() => {
            // TODO: 공유 로직
          }}
        />
        <Row
          icon="link-outline"
          label="링크 복사"
          onPress={() => {
            // TODO: 클립보드
          }}
        />
      </View>

      <View style={styles.group}>
        <Row
          icon="alert-circle-outline"
          label="신고하기"
          danger
          onPress={() => {
            // TODO: 신고
          }}
        />
        <Row
          icon="person-remove-outline"
          label="작성자 차단"
          danger
          onPress={() => {
            // TODO: 차단
          }}
        />
        {isMyThread && (
          <Row
            icon="trash-outline"
            label="게시물 삭제"
            danger
            onPress={() => {
              // TODO: 삭제
            }}
          />
        )}
      </View>
    </View>,
    { snapPoints: ['40%', '70%'], initialIndex: 1 }, // 인덱스 0은 네 전역 규칙상 닫힘
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,

    backgroundColor: COLORS.sheet_handle,
    marginBottom: SPACING.sm,
  },
  title: { ...FONT.title, color: COLORS.text, marginBottom: SPACING.sm },
  group: {
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  row: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowText: { ...FONT.body, color: COLORS.text },
});
