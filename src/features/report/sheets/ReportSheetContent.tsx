/**
 * ✅ ReportSheetContent.tsx
 * - 신고 사유 리스트 (AppFlatList 기반)
 * - ThreadMenu 스타일 통일 + 그룹박스 전체 감싸기
 * - i18nKey 규칙 적용 (STR_ prefix)
 */
import React from 'react';
import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppFlashList from '@/common/components/AppFlashList/AppFlashList';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { postContentReport } from '../api/postContentReport';
import { ReportReasonType } from '../model/ReportModel';
import { useTranslation } from 'react-i18next';

type Props = {
  contentId: string;
  parent_content_id?: string;
  content_type: string;
  memberId: string;
  onClose: () => void;
};

const ReportSheetContent: React.FC<Props> = ({
  contentId,
  parent_content_id,
  content_type,
  memberId,
  onClose,
}) => {
  const { t } = useTranslation();
  const reasons: { i18nKey: string; type: ReportReasonType; icon: string }[] = [
    {
      i18nKey: 'STR_REPORT_REASON_NOT_AGREEABLE',
      type: 'NOT_AGREEABLE',
      icon: 'alert-outline',
    },
    {
      i18nKey: 'STR_REPORT_REASON_BULLYING',
      type: 'BULLYING',
      icon: 'people-outline',
    },
    {
      i18nKey: 'STR_REPORT_REASON_UNWANTED_CONTACT',
      type: 'UNWANTED_CONTACT',
      icon: 'chatbubble-ellipses-outline',
    },
    {
      i18nKey: 'STR_REPORT_REASON_SELF_HARM',
      type: 'SELF_HARM',
      icon: 'heart-dislike-outline',
    },
    {
      i18nKey: 'STR_REPORT_REASON_VIOLENCE',
      type: 'VIOLENCE',
      icon: 'flash-outline',
    },
    {
      i18nKey: 'STR_REPORT_REASON_RESTRICTED_ITEM_SALE',
      type: 'RESTRICTED_ITEM_SALE',
      icon: 'cart-outline',
    },
    {
      i18nKey: 'STR_REPORT_REASON_SEXUAL',
      type: 'SEXUAL',
      icon: 'body-outline',
    },
    { i18nKey: 'STR_REPORT_REASON_SPAM', type: 'SPAM', icon: 'mail-outline' },
    {
      i18nKey: 'STR_REPORT_REASON_FRAUD',
      type: 'FRAUD',
      icon: 'warning-outline',
    },
    {
      i18nKey: 'STR_REPORT_REASON_PRIVACY_INVASION',
      type: 'PRIVACY_INVASION',
      icon: 'lock-closed-outline',
    },
    {
      i18nKey: 'STR_REPORT_REASON_ETC',
      type: 'ETC',
      icon: 'ellipsis-horizontal-outline',
    },
  ];

  const handleSelect = (reason: ReportReasonType) => {
    Alert.alert(
      t('STR_REPORT_ALERT_CONFIRM_TITLE'),
      t('STR_REPORT_ALERT_CONFIRM_TEXT_1'),
      [
        { text: t('STR_COMMON_CANCEL'), style: 'cancel' },
        {
          text: t('STR_COMMON_REPORT'),
          onPress: async () => {
            try {
              await postContentReport({
                content_id: contentId,
                parent_content_id,
                content_type,
                member_id: memberId,
                content_report_type: reason,
              });
              Alert.alert(
                t('STR_REPORT_SUCCESS_TITLE'),
                t('STR_REPORT_SUCCESS_MESSAGE'),
              );
              onClose();
            } catch (err) {
              console.error('❌ 신고 실패:', err);
              Alert.alert(
                t('STR_REPORT_FAIL_TITLE'),
                t('STR_REPORT_FAIL_MESSAGE'),
              );
            }
          },
        },
      ],
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof reasons)[number];
    index: number;
  }) => (
    <TouchableOpacity
      style={[styles.row, index !== reasons.length - 1 && styles.rowDivider]}
      activeOpacity={0.7}
      onPress={() => handleSelect(item.type)}
    >
      <View style={styles.left}>
        <AppIcon type="ion" name={item.icon} size={20} />
        <AppText i18nKey={item.i18nKey} variant="body" />
      </View>
      <AppIcon
        type="ion"
        name="chevron-forward"
        size={18}
        variant="secondary"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ✅ 헤더 */}
      <AppText
        i18nKey="STR_REPORT_REASON_TITLE"
        variant="title"
        style={styles.title}
      />

      {/* ✅ 그룹 박스 전체 감싸기 */}
      <View style={styles.groupBox}>
        <AppFlashList
          data={reasons}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default ReportSheetContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xs,
  },
  title: {
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  },
  groupBox: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  rowDivider: {},
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
});
