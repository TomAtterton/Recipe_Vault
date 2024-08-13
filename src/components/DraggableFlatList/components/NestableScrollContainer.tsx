import React from 'react';
import { LayoutChangeEvent, ScrollViewProps } from 'react-native';
import Animated, { useAnimatedScrollHandler, AnimatedRef } from 'react-native-reanimated';
import {
  NestableScrollContainerProvider,
  useSafeNestableScrollContainerContext,
} from '../context/nestableScrollContainerContext';
import { useStableCallback } from '../hooks/useStableCallback';

function NestableScrollContainerInner(props: ScrollViewProps) {
  const { scrollOffsetY, scrollableRef, outerScrollEnabled, containerSize, scrollViewSize } =
    useSafeNestableScrollContainerContext();

  const handleContentScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollOffsetY.value = contentOffset.y;
  }, []);

  const onLayout = useStableCallback((event: LayoutChangeEvent) => {
    const {
      nativeEvent: { layout },
    } = event;
    containerSize.value = layout.height;
  });

  const onContentSizeChange = useStableCallback((w: number, h: number) => {
    scrollViewSize.value = h;
    props.onContentSizeChange?.(w, h);
  });

  return (
    <Animated.ScrollView
      {...props}
      ref={scrollableRef}
      onLayout={onLayout}
      onScroll={handleContentScroll}
      onContentSizeChange={onContentSizeChange}
      scrollEnabled={outerScrollEnabled}
      scrollEventThrottle={16}
    />
  );
}

export const NestableScrollContainer = React.forwardRef(
  (props: ScrollViewProps, forwardedRef?: React.ForwardedRef<Animated.ScrollView>) => {
    return (
      <NestableScrollContainerProvider
        forwardedRef={(forwardedRef as AnimatedRef<Animated.ScrollView>) || undefined}
      >
        <NestableScrollContainerInner {...props} />
      </NestableScrollContainerProvider>
    );
  }
);
