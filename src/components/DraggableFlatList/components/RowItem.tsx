import React from 'react';
import { useRefs } from '../context/refContext';
import { useStableCallback } from '../hooks/useStableCallback';
import { RenderItem } from '../types';
import { typedMemo } from '../utils';

type Props<T> = {
  extraData?: any;
  drag: (itemKey: string) => void;
  item: T;
  renderItem: RenderItem<T>;
  itemKey: string;
  debug?: boolean;
  activeKey: string | null;
};

function RowItem<T>({ renderItem, item, itemKey, activeKey, drag }: Props<T>) {
  const { keyToIndexRef } = useRefs();
  const handleDrag = useStableCallback(() => {
    drag(itemKey);
  });

  const getIndex = useStableCallback(() => {
    return keyToIndexRef.current.get(itemKey);
  });

  return (
    <MemoizedInner
      isActive={activeKey === itemKey}
      drag={handleDrag}
      renderItem={renderItem}
      item={item}
      getIndex={getIndex}
    />
  );
}

export default typedMemo(RowItem);

type InnerProps<T> = {
  isActive: boolean;
  item: T;
  getIndex: () => number | undefined;
  drag: () => void;
  renderItem: RenderItem<T>;
};

function Inner<T>({ renderItem, ...rest }: InnerProps<T>) {
  return renderItem({ ...rest }) as JSX.Element;
}

const MemoizedInner = typedMemo(Inner);
