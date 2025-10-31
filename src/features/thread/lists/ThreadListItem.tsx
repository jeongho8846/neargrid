import React from 'react';
import { Thread } from '../model/ThreadModel';
import ThreadItemDetail from '../components/thread_item_detail';
import { useThreadQuery } from '../hooks/useThreadQuery';
import { createEmptyThread } from '../model/ThreadModel';

type Props = {
  threadId: string;
};

const ThreadListItem: React.FC<Props> = ({ threadId }) => {
  const { data: thread } = useThreadQuery(threadId);
  const threadData: Thread = thread ?? createEmptyThread(threadId);

  return <ThreadItemDetail item={threadData} isLoading={!thread} />;
};

export default ThreadListItem;
