// src/features/map/hooks/useMapSearch.ts

import { useState, useEffect, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

type SearchParams = {
  keyword: string;
  threadTypes: string[];
  recentTimeMinute: number;
  remainTimeMinute: number;
  includePastRemainTime: boolean;
};

export const useMapSearch = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    threadTypes: [
      'GENERAL_THREAD',
      'MOMENT_THREAD',
      'PLAN_TO_VISIT_THREAD',
      'ROUTE_THREAD',
    ],
    recentTimeMinute: 60 * 24 * 365 * 999,
    remainTimeMinute: 60 * 24 * 365,
    includePastRemainTime: false,
  });

  // ✅ 검색 화면에서 받은 파라미터 처리
  useEffect(() => {
    if (route.params) {
      console.log('🔍 [useMapSearch] 검색 화면에서 받은 params:', route.params);

      const { inputSearchText, filterOptions } = route.params as any;

      if (inputSearchText !== undefined || filterOptions) {
        const newParams = {
          keyword: inputSearchText || '',
          threadTypes: filterOptions?.thread_types || searchParams.threadTypes,
          recentTimeMinute:
            filterOptions?.recent_time_minute ?? searchParams.recentTimeMinute,
          remainTimeMinute:
            filterOptions?.remain_time_minute ?? searchParams.remainTimeMinute,
          includePastRemainTime:
            filterOptions?.is_include_past_remain_date_time ??
            searchParams.includePastRemainTime,
        };

        console.log('✅ [useMapSearch] 업데이트된 searchParams:', newParams);
        setSearchParams(newParams);
      }
    }
  }, [route.params]);

  const handleSearchPress = useCallback(() => {
    console.log('🔍 [useMapSearch] 검색 화면으로 이동');
    navigation.navigate('MapSearch');
  }, [navigation]);

  const handleClearKeyword = useCallback(() => {
    console.log('🗑️ [useMapSearch] 검색어 초기화');
    setSearchParams(prev => ({ ...prev, keyword: '' }));
  }, []);

  return {
    searchParams,
    handleSearchPress,
    handleClearKeyword,
    setSearchParams,
  };
};
