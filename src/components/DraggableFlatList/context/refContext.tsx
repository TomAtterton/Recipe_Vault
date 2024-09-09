import React, { useContext } from 'react';
import { useMemo, useRef } from 'react';
import Animated from 'react-native-reanimated';
import { useProps } from './propsContext';
import { CellData, DraggableFlatListProps } from '../types';

type RefContextValue<T> = {
  propsRef: React.MutableRefObject<DraggableFlatListProps<T>>;
  cellDataRef: React.MutableRefObject<Map<string, CellData>>;
  keyToIndexRef: React.MutableRefObject<Map<string, number>>;
  containerRef: React.RefObject<Animated.View>;
};
const RefContext = React.createContext<RefContextValue<any> | undefined>(undefined);

export default function RefProvider<T>({ children }: { children: React.ReactNode }) {
  const value = useSetupRefs<T>();
  return <RefContext.Provider value={value}>{children}</RefContext.Provider>;
}

export function useRefs<T>() {
  const value = useContext(RefContext);
  if (!value) {
    throw new Error('useRefs must be called from within a RefContext.Provider!');
  }
  return value as RefContextValue<T>;
}

function useSetupRefs<T>() {
  const props = useProps<T>();

  const propsRef = useRef(props);

  propsRef.current = props;

  const cellDataRef = useRef(new Map<string, CellData>());
  const keyToIndexRef = useRef(new Map<string, number>());
  const containerRef = useRef<Animated.View>(null);

  const refs = useMemo(
    () => ({
      cellDataRef,
      containerRef,
      keyToIndexRef,
      propsRef,
    }),
    [],
  );

  return refs;
}
