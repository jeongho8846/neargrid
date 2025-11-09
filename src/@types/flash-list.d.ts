declare module '@shopify/flash-list' {
  import * as React from 'react';
  import { FlatListProps } from 'react-native';

  export interface FlashListProps<ItemT> extends FlatListProps<ItemT> {
    /**
     * Approximate average item size in pixels.
     * Optional in FlashList v2, but safe for compatibility.
     */
    estimatedItemSize?: number;
  }

  export class FlashList<ItemT> extends React.Component<
    FlashListProps<ItemT>
  > {}
}
