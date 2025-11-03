// 📄 src/common/styles/colors.ts
export const COLORS = {
  // 🟣 Button
  button_active: '#0447ffff',
  button_disabled: '#A0CFFF',
  button_pressed: '#005BBB',
  button_surface: '#1C1C1C',

  // 📝 Text (Dark Theme)
  title: '#FFFFFF', // 제목/섹션 타이틀 (밝은 흰색)
  body: '#FFFFFF', // 본문 텍스트
  username: '#EDEDED', // 닉네임 강조
  caption: '#919191', // 보조정보 (시간, 좋아요 수)
  link_variant: '#b3b4ecff', // 링크/팔로우 등 액션 텍스트
  button_variant: '#FFFFFF', // 버튼 텍스트
  danger_variant: '#FF3B30', // 삭제/로그아웃 등 위험 텍스트

  // 🧩 Icons (Dark Theme 기준)
  icon_primary: '#EDEDED', // 기본 아이콘 (본문 대비 약간 밝음)
  icon_secondary: '#919191', // 보조/비활성
  icon_active: '#FFFFFF', // 선택 탭/활성 상태
  icon_liked: '#ED4956', // 좋아요
  icon_onDark: '#FFFFFF', // 영상/스토리 위 흰색
  icon_badge: '#FA3E3E', // 알림 점
  icon_brand: '#0095F6', // 팔로우/CTA
  icon_verified: '#0095F6', // 인증 배지용

  // ✏️ Input / TextField
  input_background: '#1E1E1E', // 입력창 배경 (sheet보다 살짝 밝음)
  input_text: '#FFFFFF', // 실제 입력 텍스트
  input_placeholder: '#919191', // placeholder (caption 수준)
  input_border: '#333333', // 입력창 테두리 (optional)

  // 💬 Text Bubble
  text_bubble_background: '#25054D',
  text_bubble_border: '#1B1B1B',

  // 🧱 Layout
  background: '#110E03',
  border: '#46464665',

  // 📱 Bottom Sheet
  sheet_background: '#1C1C1C',
  sheet_handle: '#444444',
  sheet_backdrop: 'rgba(0,0,0,0.7)',

  // ⚙️ System
  error: '#FF3B30',

  // 🎖️ Badge
  badge_background: '#FF6259',

  // 🧭 Navigation
  nav_active: '#FFFFFF',
  nav_inactive: '#888888',

  // 🖼️ Image
  emty_imageBox: '#888888',

  // 🔘 Dot Indicators
  dot_active: '#721BFD',
  dot_inactive: '#CCCCCCD8',

  // 🩶 Skeleton (Dark Mode)
  skeleton_bone_light: '#181408',
  skeleton_bone_dark: 'rgba(80,80,80,0.35)',
  skeleton_highlight_light: 'rgba(24,20,8,0.11)',
  skeleton_highlight_dark: 'rgba(150,150,150,0.5)',

  // 🔹 Overlay / Transparency
  overlay_light: 'rgba(255,255,255,0.25)', // 밝은 배경용 오버레이
  overlay_dark: 'rgba(0,0,0,0.35)', // 어두운 배경용 오버레이 ✅
  overlay_strong: 'rgba(0,0,0,0.55)', // 강조용 (이미지 어둡게)

  /** 🧩 Thread Type Colors (텍스트 색상용) */
  GENERAL_THREAD: '#E0E0E0', // 일반
  ROUTE_THREAD: '#fdbb40ff', // 기부
  PLAN_TO_VISIT_THREAD: '#8840fdff', // 이벤트
  MOMENT_THREAD: '#00d1d8ff', // 공지
} as const;

export type ColorKeys = keyof typeof COLORS;
