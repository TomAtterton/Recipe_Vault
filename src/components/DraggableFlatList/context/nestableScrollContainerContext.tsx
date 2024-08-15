import React, { useContext } from 'react';
import Animated, { useAnimatedRef, useSharedValue, AnimatedRef } from 'react-native-reanimated';

type NestableScrollContainerContextVal = ReturnType<any>;
const NestableScrollContainerContext = React.createContext<
  NestableScrollContainerContextVal | undefined
>(undefined);

export function NestableScrollContainerProvider({
  children,
  forwardedRef,
}: {
  children: React.ReactNode;
  forwardedRef?: AnimatedRef<Animated.ScrollView>;
}) {
  const outerScrollEnabled = useSharedValue(true);
  const scrollViewSize = useSharedValue(0);
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();
  const containerSize = useSharedValue(0);
  const scrollOffsetY = useSharedValue(0);
  const listVerticalOffset = useSharedValue(0);

  return (
    <NestableScrollContainerContext.Provider
      value={{
        outerScrollEnabled,
        scrollableRef: forwardedRef ?? scrollableRef,
        scrollViewSize,
        containerSize,
        scrollOffsetY,
        listVerticalOffset,
      }}
    >
      {children}
    </NestableScrollContainerContext.Provider>
  );
}

export function useNestableScrollContainerContext() {
  const value = useContext(NestableScrollContainerContext);
  return value;
}

export function useSafeNestableScrollContainerContext() {
  const value = useNestableScrollContainerContext();
  if (!value) {
    throw new Error(
      'useSafeNestableScrollContainerContext must be called within a NestableScrollContainerContext.Provider'
    );
  }
  return value;
}
