import React from 'react';
import AppFlatList from '@/common/components/AppFlatList';
import ThreadItemDetail from '../components/thread_item_detail';

const mockThreads = Array.from({ length: 50 }).map((_, i) => ({
  id: String(i + 1),
  author: `neargrid_user_${i + 1}`,
  media:
    i % 5 === 1
      ? [
          `https://picsum.photos/400/300?random=${i * 3 + 1}`,
          `https://picsum.photos/400/300?random=${i * 3 + 2}`,
          `https://picsum.photos/400/300?random=${i * 3 + 3}`,
        ]
      : `https://picsum.photos/400/300?random=${i + 10}`,
  caption:
    'screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1screen.feed.caption1',
}));

export default function ThreadList() {
  return (
    <AppFlatList
      tabBarAutoHide
      headerAutoHide
      data={mockThreads}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ThreadItemDetail item={item} />}
      style={{ paddingTop: 120 }}
    />
  );
}
