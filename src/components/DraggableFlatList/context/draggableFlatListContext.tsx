import React, { useContext, useMemo } from 'react';
import { SharedValue } from 'react-native-reanimated';

type Props<T> = {
  activeKey: SharedValue<string | null>;
  keyExtractor: (item: T, index: number) => string;
  children: React.ReactNode;
};

type DraggableFlatListContextValue<T> = Omit<Props<T>, 'children'>;

const DraggableFlatListContext = React.createContext<
  DraggableFlatListContextValue<any> | undefined
>(undefined);

export default function DraggableFlatListProvider<T>({
  activeKey,
  keyExtractor,
  children,
}: Props<T>) {
  const value = useMemo(
    () => ({
      activeKey,
      keyExtractor,
    }),
    [activeKey, keyExtractor]
  );

  return (
    <DraggableFlatListContext.Provider value={value}>{children}</DraggableFlatListContext.Provider>
  );
}

export function useDraggableFlatListContext<T>() {
  const value = useContext(DraggableFlatListContext);
  if (!value) {
    throw new Error('useDraggableFlatListContext must be called within DraggableFlatListProvider');
  }
  return value as DraggableFlatListContextValue<T>;
}
