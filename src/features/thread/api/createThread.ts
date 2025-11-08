import { apiContents } from '@/services/apiService';

export const createThread = async (formData: FormData, token: string) => {
  console.log('리퀘스트 데이터', formData);
  return await apiContents.post('/thread/createThread', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};
