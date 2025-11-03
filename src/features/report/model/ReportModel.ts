/**
 * ✅ ReportModel
 * - 신고 도메인 타입 정의
 */

export type ReportReasonType =
  | 'NOT_AGREEABLE'
  | 'BULLYING'
  | 'UNWANTED_CONTACT'
  | 'SELF_HARM'
  | 'VIOLENCE'
  | 'RESTRICTED_ITEM_SALE'
  | 'SEXUAL'
  | 'SPAM'
  | 'FRAUD'
  | 'PRIVACY_INVASION'
  | 'ETC';

export interface ReportRequestDto {
  content_id: string;
  content_type: string;
  parent_content_id?: string;
  member_id: string;
  content_report_type: ReportReasonType;
}
