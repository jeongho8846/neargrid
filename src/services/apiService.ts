// services/apiService.ts
import axios, { AxiosInstance } from 'axios';
import { Alert } from 'react-native';
import {
  MEMBER_API_BASE_URL,
  CONTENTS_API_BASE_URL,
  CHAT_API_BASE_URL,
} from '@env';
import { tokenStorage } from '@/features/member/utils/tokenStorage';
import { refreshTokenApi } from '@/features/member/api/refreshToken';
import { apiWithToken } from './apiWithToken';

const createApiClient = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  // ✅ request 인터셉터: accessToken 주입
  api.interceptors.request.use(async config => {
    const { accessToken } = await tokenStorage.getTokens();
    if (
      accessToken &&
      config.url &&
      apiWithToken.some(path => config.url?.startsWith(path))
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(`🔐 Token attached → ${config.url}`);
    } else {
      console.log(`🌐 Public request → ${config.url}`);
    }
    return config;
  });

  // ✅ response 인터셉터: 401 → refresh 처리
  // let isRefreshing = false;
  // let failedQueue: any[] = [];

  // const processQueue = (error: any, token: string | null = null) => {
  //   failedQueue.forEach(prom => {
  //     if (error) prom.reject(error);
  //     else prom.resolve(token);
  //   });
  //   failedQueue = [];
  // };

  // api.interceptors.response.use(
  //   res => res,
  //   async err => {
  //     const originalRequest = err.config;

  //     if (err.response?.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;

  //       if (isRefreshing) {
  //         return new Promise((resolve, reject) => {
  //           failedQueue.push({ resolve, reject });
  //         })
  //           .then(token => {
  //             originalRequest.headers.Authorization = `Bearer ${token}`;
  //             return api(originalRequest);
  //           })
  //           .catch(queueErr => Promise.reject(queueErr));
  //       }

  //       isRefreshing = true;
  //       try {
  //         const { refreshToken } = await tokenStorage.getTokens();
  //         if (!refreshToken) throw new Error('No refresh token found');

  //         // ✅ 서버에 refresh 요청
  //         const dto = await refreshTokenApi(refreshToken);

  //         // ✅ 토큰/유저정보 갱신
  //         await tokenStorage.saveTokens(dto.accessToken, dto.refreshToken);
  //         await tokenStorage.saveUserInfo(dto);

  //         api.defaults.headers.common.Authorization = `Bearer ${dto.accessToken}`;
  //         processQueue(null, dto.accessToken);

  //         originalRequest.headers.Authorization = `Bearer ${dto.accessToken}`;
  //         return api(originalRequest);
  //       } catch (refreshErr) {
  //         processQueue(refreshErr, null);
  //         await tokenStorage.clear(); // ✅ 안전하게 전부 삭제
  //         Alert.alert('세션 만료', '다시 로그인해주세요.');
  //         return Promise.reject(refreshErr);
  //       } finally {
  //         isRefreshing = false;
  //       }
  //     }
  //     return Promise.reject(err);
  //   },
  // );

  return api;
};

// ✅ Export API Clients
export const apiMember = createApiClient(MEMBER_API_BASE_URL);
export const apiContents = createApiClient(CONTENTS_API_BASE_URL);
export const apiChat = createApiClient(CHAT_API_BASE_URL);
