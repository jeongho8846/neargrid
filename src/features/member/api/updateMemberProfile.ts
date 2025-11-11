// 📄 src/features/member/api/updateMemberProfile.ts
import { apiContents, apiMember } from '@/services/apiService';

/** 🧩 닉네임 수정 */
export const updateMemberNickName = async (
  memberId: string,
  nickName: string,
) => {
  console.log('📡 [REQ] updateMemberNickName:', { memberId, nickName });
  try {
    const response = await apiMember.post('/member/updateNickName', {
      memberId,
      nickName,
    });
    console.log('✅ [RES] updateMemberNickName:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '❌ [ERR] updateMemberNickName:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

/** 🧩 실명 수정 */
export const updateMemberRealName = async (
  memberId: string,
  realName: string,
) => {
  console.log('📡 [REQ] updateMemberRealName:', { memberId, realName });
  try {
    const response = await apiMember.post('/member/updateRealName', {
      memberId,
      realName,
    });
    console.log('✅ [RES] updateMemberRealName:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '❌ [ERR] updateMemberRealName:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

/** 🧩 자기소개 수정 */
export const updateMemberProfileText = async (
  memberId: string,
  text: string,
) => {
  const formData = new FormData();
  formData.append('member_id', memberId);
  formData.append('profile_text', text);
  console.log('📡 [REQ] updateMemberProfileText:', { memberId, text });

  try {
    const response = await apiContents.post(
      '/member/updateProfileText',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    console.log('✅ [RES] updateMemberProfileText:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '❌ [ERR] updateMemberProfileText:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

/** 🧩 프로필 이미지 업로드 */
export const uploadMemberProfileImage = async (
  memberId: string,
  image: { uri: string; mime: string; filename?: string },
) => {
  const file = {
    uri: image.uri.startsWith('file://') ? image.uri : `file://${image.uri}`,
    name: image.filename || `${Date.now()}.jpg`,
    type: image.mime || 'image/jpeg',
  };

  const formData = new FormData();
  formData.append('member_id', memberId);
  formData.append('multipartFile', file as any);

  console.log('📡 [REQ] uploadMemberProfileImage:', { memberId, file });

  try {
    const response = await apiMember.post(
      '/member/registerProfileImage',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    console.log('✅ [RES] uploadMemberProfileImage:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '❌ [ERR] uploadMemberProfileImage:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

/** 🧩 커버 이미지 업로드 */
export const uploadMemberCoverImage = async (
  memberId: string,
  image: { uri: string; mime: string; filename?: string },
) => {
  const file = {
    uri: image.uri.startsWith('file://') ? image.uri : `file://${image.uri}`,
    name: image.filename || `${Date.now()}.jpg`,
    type: image.mime || 'image/jpeg',
  };

  const formData = new FormData();
  formData.append('member_id', memberId);
  formData.append('multipartFile', file as any);

  console.log('📡 [REQ] uploadMemberCoverImage:', { memberId, file });

  try {
    const response = await apiMember.post(
      '/member/registerCoverImage',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    console.log('✅ [RES] uploadMemberCoverImage:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '❌ [ERR] uploadMemberCoverImage:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
