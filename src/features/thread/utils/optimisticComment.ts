// src/features/thread/utils/optimisticComment.ts
import {
  optimisticAddItem,
  optimisticReplaceItem,
  optimisticRemoveItem,
} from '@/utils/optimisticList';

type CommentPage = { comments: any[] };

export const optimisticAddComment = (queryKey: any[], tempComment: any) =>
  optimisticAddItem<CommentPage>(queryKey, 'comments', tempComment);

export const optimisticReplaceComment = (
  queryKey: any[],
  tempId: string,
  real: any,
) =>
  optimisticReplaceItem<CommentPage>(
    queryKey,
    'comments',
    tempId,
    real,
    'commentThreadId',
  );

export const optimisticRemoveComment = (queryKey: any[], tempId: string) =>
  optimisticRemoveItem<CommentPage>(
    queryKey,
    'comments',
    tempId,
    'commentThreadId',
  );
