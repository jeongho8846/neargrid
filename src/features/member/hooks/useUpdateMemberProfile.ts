import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import {
  updateMemberNickName,
  updateMemberRealName,
  updateMemberProfileText,
  uploadMemberProfileImage,
  uploadMemberCoverImage,
} from '../api/updateMemberProfile';
import { memberStorage } from '../utils/memberStorage';
import { useTranslation } from 'react-i18next';

/** ✅ 닉네임 수정 훅 */
export const useUpdateNickName = (memberId: string) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (nickName: string) => {
      console.log('🟡 [useUpdateNickName] 요청:', { memberId, nickName });
      const data = await updateMemberNickName(memberId, nickName);
      console.log('🟢 [useUpdateNickName] 응답:', data);
      if (data?.success === false) throw new Error(data?.message);
      return nickName;
    },
    onSuccess: async (nickName: string) => {
      Alert.alert(t('Success'), t('닉네임이 저장되었습니다.'));
      const stored = await memberStorage.getMember();
      if (stored) {
        await memberStorage.saveMember({ ...stored, nickName });
        console.log('✅ [memberStorage] 닉네임 업데이트 완료');
      }
    },
    onError: (err: any) => {
      console.error('❌ [useUpdateNickName] 오류:', err?.message);
      Alert.alert(t('STR_ERROR'), t('닉네임 저장에 실패했습니다.'));
    },
  });
};

/** ✅ 실명 수정 훅 */
export const useUpdateRealName = (memberId: string) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (realName: string) => {
      console.log('🟡 [useUpdateRealName] 요청:', { memberId, realName });
      const data = await updateMemberRealName(memberId, realName);
      console.log('🟢 [useUpdateRealName] 응답:', data);
      if (data?.success === false) throw new Error(data?.message);
      return realName;
    },
    onSuccess: async (realName: string) => {
      Alert.alert(t('Success'), t('실명이 저장되었습니다.'));
      const stored = await memberStorage.getMember();
      if (stored) {
        await memberStorage.saveMember({ ...stored, realName });
        console.log('✅ [memberStorage] 실명 업데이트 완료');
      }
    },
    onError: (err: any) => {
      console.error('❌ [useUpdateRealName] 오류:', err?.message);
      Alert.alert(t('STR_ERROR'), t('실명 저장에 실패했습니다.'));
    },
  });
};

/** ✅ 자기소개 수정 훅 */
export const useUpdateProfileText = (memberId: string) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (text: string) => {
      console.log('🟡 [useUpdateProfileText] 요청:', { memberId, text });
      const data = await updateMemberProfileText(memberId, text);
      console.log('🟢 [useUpdateProfileText] 응답:', data);
      if (data?.success === false) throw new Error(data?.message);
      return text;
    },
    onSuccess: async (text: string) => {
      Alert.alert(t('Success'), t('소개글이 저장되었습니다.'));
      const stored = await memberStorage.getMember();
      if (stored) {
        await memberStorage.saveMember({ ...stored, profileText: text });
        console.log('✅ [memberStorage] 소개글 업데이트 완료');
      }
    },
    onError: (err: any) => {
      console.error('❌ [useUpdateProfileText] 오류:', err?.message);
      Alert.alert(t('STR_ERROR'), t('소개글 저장에 실패했습니다.'));
    },
  });
};

/** ✅ 프로필 이미지 업로드 훅 */
export const useUploadProfileImage = (memberId: string) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (image: {
      uri: string;
      mime: string;
      filename?: string;
    }) => {
      console.log('🟡 [useUploadProfileImage] 요청:', { memberId, image });
      const data = await uploadMemberProfileImage(memberId, image);
      console.log('🟢 [useUploadProfileImage] 응답:', data);
      if (data?.success === false) throw new Error(data?.message);
      return data?.imageUrl ?? null;
    },
    onSuccess: async (imageUrl: string | null) => {
      Alert.alert(t('Success'), t('프로필 이미지가 변경되었습니다.'));
      const stored = await memberStorage.getMember();
      if (stored && imageUrl) {
        await memberStorage.saveMember({
          ...stored,
          profileImageUrl: imageUrl,
        });
        console.log('✅ [memberStorage] 프로필 이미지 업데이트 완료');
      }
    },
    onError: (err: any) => {
      console.error('❌ [useUploadProfileImage] 오류:', err?.message);
      Alert.alert(t('STR_ERROR'), t('프로필 이미지 변경에 실패했습니다.'));
    },
  });
};

/** ✅ 커버 이미지 업로드 훅 */
export const useUploadCoverImage = (memberId: string) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (image: {
      uri: string;
      mime: string;
      filename?: string;
    }) => {
      console.log('🟡 [useUploadCoverImage] 요청:', { memberId, image });
      const data = await uploadMemberCoverImage(memberId, image);
      console.log('🟢 [useUploadCoverImage] 응답:', data);
      if (data?.success === false) throw new Error(data?.message);
      return data?.imageUrl ?? null;
    },
    onSuccess: async (imageUrl: string | null) => {
      Alert.alert(t('Success'), t('커버 이미지가 변경되었습니다.'));
      const stored = await memberStorage.getMember();
      if (stored && imageUrl) {
        await memberStorage.saveMember({ ...stored, coverImageUrl: imageUrl });
        console.log('✅ [memberStorage] 커버 이미지 업데이트 완료');
      }
    },
    onError: (err: any) => {
      console.error('❌ [useUploadCoverImage] 오류:', err?.message);
      Alert.alert(t('STR_ERROR'), t('커버 이미지 변경에 실패했습니다.'));
    },
  });
};
