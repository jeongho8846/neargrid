/**
 * ✅ reportUtils.ts
 * - 신고 관련 공통 유틸
 */

import { ReportRequestDto } from '../model/ReportModel';

export const buildReportFormData = (data: ReportRequestDto): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value ?? '');
  });
  return formData;
};
