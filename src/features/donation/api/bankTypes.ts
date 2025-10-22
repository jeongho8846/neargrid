// src/features/donationapi/bankTypes.ts
export type BankCode =
  | 'SHINHAN' // 신한은행
  | 'KB' // KB국민은행
  | 'WOORI' // 우리은행
  | 'HANA' // 하나은행
  | 'NH' // 농협은행
  | 'IBK' // IBK기업은행
  | 'SC' // SC제일은행
  | 'CITI' // 한국씨티은행
  | 'KAKAOBANK' // 카카오뱅크
  | 'KBANK' // 케이뱅크
  | 'TOSS' // 토스뱅크
  | 'DGB' // DGB대구은행
  | 'BNK_BUSAN' // BNK부산은행
  | 'BNK_KYONGNAM' // BNK경남은행
  | 'JB' // 전북은행(JB Bank)
  | 'KJ' // 광주은행(KJ Bank)
  | 'JEJU' // 제주은행
  | 'SUHYUP' // 수협은행
  | 'KDB' // 한국산업은행(KDB)
  | 'EXIM'; // 한국수출입은행(KEXIM)

export type BankOption = {
  code: BankCode;
  ko: string; // 국문명
  en: string; // 공식 영문명(브랜드 표기 포함)
};

export const BANKS: BankOption[] = [
  { code: 'SHINHAN', ko: '신한은행', en: 'Shinhan Bank' },
  { code: 'KB', ko: 'KB국민은행', en: 'KB Kookmin Bank' },
  { code: 'WOORI', ko: '우리은행', en: 'Woori Bank' },
  { code: 'HANA', ko: '하나은행', en: 'Hana Bank' },
  { code: 'NH', ko: '농협은행', en: 'NongHyup Bank (NH Bank)' },
  { code: 'IBK', ko: 'IBK기업은행', en: 'Industrial Bank of Korea (IBK)' },
  { code: 'SC', ko: 'SC제일은행', en: 'Standard Chartered Bank Korea' },
  { code: 'CITI', ko: '한국씨티은행', en: 'Citibank Korea' },
  { code: 'KAKAOBANK', ko: '카카오뱅크', en: 'KakaoBank' },
  { code: 'KBANK', ko: '케이뱅크', en: 'K Bank' },
  { code: 'TOSS', ko: '토스뱅크', en: 'Toss Bank' },
  { code: 'DGB', ko: 'DGB대구은행', en: 'DGB Daegu Bank' },
  { code: 'BNK_BUSAN', ko: 'BNK부산은행', en: 'BNK Busan Bank' },
  { code: 'BNK_KYONGNAM', ko: 'BNK경남은행', en: 'BNK Kyongnam Bank' },
  { code: 'JB', ko: '전북은행', en: 'Jeonbuk Bank (JB Bank)' },
  { code: 'KJ', ko: '광주은행', en: 'Gwangju Bank (KJ Bank)' },
  { code: 'JEJU', ko: '제주은행', en: 'Jeju Bank' },
  { code: 'SUHYUP', ko: '수협은행', en: 'Suhyup Bank' },
  { code: 'KDB', ko: '한국산업은행', en: 'Korea Development Bank (KDB)' },
  {
    code: 'EXIM',
    ko: '한국수출입은행',
    en: 'The Export-Import Bank of Korea (KEXIM)',
  },
];

// 헬퍼
export const findBank = (code: BankCode) => BANKS.find(b => b.code === code)!;
