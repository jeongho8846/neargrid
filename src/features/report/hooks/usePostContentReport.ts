/**
 * ✅ usePostContentReport.ts
 * - 신고 전송용 Mutation 훅
 */

import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { postContentReport } from '../api/postContentReport';
import { ReportRequestDto } from '../model/ReportModel';

export const usePostContentReport = (onSuccess?: () => void) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: ReportRequestDto) => postContentReport(payload),
    onSuccess: () => {
      Alert.alert(
        t('Report'),
        t('You have successfully reported this content.'),
      );
      onSuccess?.();
    },
    onError: () => {
      Alert.alert(t('Report'), t('This content has already been reported'));
    },
  });
};
