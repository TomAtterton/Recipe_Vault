import React, { useContext } from 'react';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  AnimatedRef,
  SharedValue,
} from 'react-native-reanimated';

type NestableScrollContainerContextVal = {
  outerScrollEnabled: SharedValue<boolean>;
  scrollableRef: AnimatedRef<Animated.ScrollView>;
  scrollViewSize: SharedValue<number>;
  containerSize: SharedValue<number>;
  scrollOffsetY: SharedValue<number>;
  listVerticalOffset: SharedValue<number>;
};

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
  return useContext(NestableScrollContainerContext);
}

export function useSafeNestableScrollContainerContext() {
  const value = useNestableScrollContainerContext();
  if (!value) {
    throw new Error(
      'useSafeNestableScrollContainerContext must be called within a NestableScrollContainerContext.Provider',
    );
  }
  return value;
}
