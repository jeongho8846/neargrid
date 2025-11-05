// 📄 src/screens/debug/SnsUiDemoScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AppText from '@/common/components/AppText';
import AppButton from '@/common/components/AppButton';
import AppIcon from '@/common/components/AppIcon';
import AppProfileImage from '@/common/components/AppProfileImage';

const SnsUiDemoScreen: React.FC = () => {
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <AppText i18nKey="STR_SNS_DEMO_TITLE" variant="title" />
          <View style={styles.headerRight}>
            <AppIcon
              name="notifications-outline"
              type="ion"
              variant="secondary"
            />
            <View style={{ width: 12 }} />
            <AppProfileImage size={28} />
          </View>
        </View>

        {/* 1️⃣ 피드 카드 (인스타 스타일) */}
        <SectionTitle i18nKey="STR_SECTION_FEED" />
        <FeedCard />
        <FeedCard />

        {/* 2️⃣ 댓글 팝업 스타일 */}
        <SectionTitle i18nKey="STR_SECTION_COMMENTS" />
        <View style={styles.card}>
          <AppText i18nKey="STR_COMMENTS_TITLE" variant="title" />
          <View style={{ height: 10 }} />
          <CommentBubble username="miles" text="사진 분위기 너무 좋네요!" />
          <CommentBubble username="alex" text="여기 어디예요? 가보고 싶다 😍" />
          <CommentBubble username="you" isMine text="덕수궁 돌담길 근처에요!" />

          <View style={styles.commentInputRow}>
            <AppProfileImage size={28} />
            <View style={{ width: 8 }} />
            <View style={styles.commentInputBox}>
              <AppText i18nKey="STR_COMMENTS_PLACEHOLDER" variant="caption" />
            </View>
            <View style={{ width: 8 }} />
            <AppButton i18nKey="STR_SEND" size="small" variant="primary" />
          </View>
        </View>

        {/* 3️⃣ 프로필 섹션 */}
        <SectionTitle i18nKey="STR_SECTION_PROFILE" />
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <AppProfileImage size={72} />
            <View style={styles.profileInfo}>
              <AppText variant="username">Soyoung</AppText>
              <AppText variant="caption">@soyongs</AppText>
              <View style={{ height: 4 }} />
              <AppText variant="body">
                자연과 함께 걷는 순간들을 기록해요.
              </AppText>
            </View>
          </View>

          <View style={styles.profileStatsRow}>
            <ProfileStat label="Posts" value="145" />
            <ProfileStat label="Followers" value="9.8K" />
            <ProfileStat label="Following" value="321" />
          </View>

          <View style={styles.profileButtonRow}>
            <AppButton
              i18nKey="STR_FOLLOW"
              variant="primary"
              style={{ flex: 1, marginRight: 8 }}
            />
            <AppButton
              i18nKey="STR_MESSAGE"
              variant="ghost"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* 4️⃣ 알림 리스트 */}
        <SectionTitle i18nKey="STR_SECTION_NOTIFICATIONS" />
        <View style={styles.card}>
          <NotificationItem
            icon="heart"
            text="luna 님이 회원님의 게시물을 좋아합니다."
          />
          <NotificationItem
            icon="chatbubble-ellipses"
            text="andy 님이 댓글을 남겼습니다: '사진 너무 예뻐요!'"
          />
          <NotificationItem
            icon="person-add"
            text="neo 님이 회원님을 팔로우하기 시작했습니다."
          />
        </View>

        {/* 5️⃣ 채팅 미리보기 */}
        <SectionTitle i18nKey="STR_SECTION_CHAT" />
        <View style={styles.card}>
          <View style={styles.chatRow}>
            <AppProfileImage size={40} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <AppText variant="username">luna</AppText>
              <AppText variant="caption">
                오늘 저녁에 시간 돼요? 카페 가요 ☕
              </AppText>
            </View>
            <AppText variant="caption">2m</AppText>
          </View>

          <View style={{ height: 10 }} />

          <View style={styles.chatBubbleRow}>
            <View style={styles.chatBubbleLeft}>
              <AppText variant="body">퇴근하고 바로 갈게요!</AppText>
            </View>
          </View>
          <View style={styles.chatBubbleRowMine}>
            <View style={styles.chatBubbleRight}>
              <AppText variant="body">좋아요 🙌 7시 어떠세요?</AppText>
            </View>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

export default SnsUiDemoScreen;

/* ──────────────── 보조 컴포넌트 ──────────────── */

const SectionTitle = ({ i18nKey }: { i18nKey: string }) => (
  <View style={styles.sectionTitleRow}>
    <AppText i18nKey={i18nKey} variant="title" />
  </View>
);

const FeedCard = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.row}>
        <AppProfileImage size={36} />
        <View style={{ marginLeft: 10 }}>
          <AppText variant="username">soyoungs</AppText>
          <AppText variant="caption">3h • Seoul</AppText>
        </View>
      </View>
      <AppIcon name="ellipsis-horizontal" type="ion" variant="secondary" />
    </View>

    <View style={styles.feedImagePlaceholder}>
      <AppText i18nKey="STR_FEED_IMAGE_PLACEHOLDER" variant="caption" />
    </View>

    <View style={styles.actionRow}>
      <View style={styles.row}>
        <AppIcon name="heart-outline" type="ion" variant="primary" />
        <View style={{ width: 16 }} />
        <AppIcon name="chatbubble-outline" type="ion" variant="primary" />
        <View style={{ width: 16 }} />
        <AppIcon name="paper-plane-outline" type="ion" variant="primary" />
      </View>
      <AppIcon name="bookmark-outline" type="ion" variant="secondary" />
    </View>

    <AppText variant="body">좋아요 348개</AppText>
    <View style={{ height: 4 }} />
    <AppText variant="body">주말 햇살 터지는 길에서 한 컷 ☀️</AppText>
    <AppText variant="caption">댓글 13개 모두 보기</AppText>
  </View>
);

const CommentBubble: React.FC<{
  username: string;
  text: string;
  isMine?: boolean;
}> = ({ username, text, isMine }) => (
  <View style={[styles.commentRow, isMine && { justifyContent: 'flex-end' }]}>
    {!isMine && <AppProfileImage size={28} />}
    <View style={{ width: 8 }} />
    <View
      style={[styles.commentBubble, isMine && { backgroundColor: '#4A6CF7' }]}
    >
      <AppText variant="username">{username}</AppText>
      <AppText variant="body">{text}</AppText>
    </View>
  </View>
);

const ProfileStat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.profileStat}>
    <AppText variant="body">{value}</AppText>
    <AppText variant="caption">{label}</AppText>
  </View>
);

const NotificationItem: React.FC<{ icon: string; text: string }> = ({
  icon,
  text,
}) => (
  <View style={styles.notificationRow}>
    <AppIcon name={icon} type="ion" variant="active" />
    <View style={{ marginLeft: 10, flex: 1 }}>
      <AppText variant="body">{text}</AppText>
    </View>
    <AppIcon name="chevron-forward" type="ion" variant="secondary" />
  </View>
);

/* ──────────────── 스타일 ──────────────── */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0E0E0E',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleRow: {
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#181818',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  profileCard: {
    backgroundColor: '#181818',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedImagePlaceholder: {
    height: 400,
    borderRadius: 16,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  commentBubble: {
    flexShrink: 1,
    backgroundColor: '#2B2B2B',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInputBox: {
    flex: 1,
    backgroundColor: '#2B2B2B',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  profileStat: {
    alignItems: 'center',
    flex: 1,
  },
  profileButtonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatBubbleRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chatBubbleRowMine: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  chatBubbleLeft: {
    maxWidth: '80%',
    backgroundColor: '#232323',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chatBubbleRight: {
    maxWidth: '80%',
    backgroundColor: '#4A6CF7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
