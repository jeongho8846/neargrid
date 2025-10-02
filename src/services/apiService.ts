// services/apiService.ts
import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import {
  MEMBER_API_BASE_URL,
  CONTENTS_API_BASE_URL,
  CHAT_API_BASE_URL,
} from '@env';
import { refreshAccessToken } from '../Root/fetch/authApi';
import { apiWithToken } from './apiWithToken'; // ✅ 분리된 목록 import

/**
 * Access Token 가져오기
 */
const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (e) {
    console.error('❌ Failed to get access token', e);
    return null;
  }
};

/**
 * Refresh Token 가져오기
 */
const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('refreshToken');
  } catch (e) {
    console.error('❌ Failed to get refresh token', e);
    return null;
  }
};

/**
 * Axios 인스턴스 생성
 */
const createApiClient = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  // ✅ request 인터셉터: 토큰 주입
  api.interceptors.request.use(async config => {
    const token = await getAccessToken();
    if (
      token &&
      config.url &&
      apiWithToken.some(path => config.url?.startsWith(path))
    ) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 Token attached → ${config.url}`);
    } else {
      console.log(`🌐 Public request → ${config.url}`);
    }
    return config;
  });

  // ✅ response 인터셉터: 401 → refresh 처리
  let isRefreshing = false;
  let failedQueue: any[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueue = [];
  };

  api.interceptors.response.use(
    res => res,
    async err => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch(queueErr => Promise.reject(queueErr));
        }

        isRefreshing = true;
        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) throw new Error('No refresh token found');

          const newTokens = await refreshAccessToken(refreshToken);
          const newAccessToken = newTokens?.accessToken;

          if (!newAccessToken) throw new Error('Refresh failed');

          await AsyncStorage.setItem('accessToken', newAccessToken);

          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          Alert.alert('세션 만료', '다시 로그인해주세요.');
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(err);
    },
  );

  return api;
};

/**
 * Export API Clients
 */
export const apiMember = createApiClient(MEMBER_API_BASE_URL);
export const apiContents = createApiClient(CONTENTS_API_BASE_URL);
export const apiChat = createApiClient(CHAT_API_BASE_URL);
