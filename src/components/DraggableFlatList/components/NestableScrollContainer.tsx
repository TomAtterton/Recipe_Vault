import React from 'react';
import { LayoutChangeEvent, ScrollViewProps } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  AnimatedRef,
  useAnimatedProps,
} from 'react-native-reanimated';
import {
  NestableScrollContainerProvider,
  useSafeNestableScrollContainerContext,
} from '../context/nestableScrollContainerContext';
import { useStableCallback } from '../hooks/useStableCallback';

const NestableScrollContainerInner = (props: ScrollViewProps) => {
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

  const animatedProps = useAnimatedProps(() => {
    return {
      scrollEnabled: outerScrollEnabled.value,
    };
  });

  return (
    <Animated.ScrollView
      {...props}
      ref={scrollableRef}
      onLayout={onLayout}
      onScroll={handleContentScroll}
      onContentSizeChange={onContentSizeChange}
      animatedProps={animatedProps}
      scrollEventThrottle={16}
    />
  );
};

export const NestableScrollContainer = React.forwardRef(
  (props: ScrollViewProps, forwardedRef?: React.ForwardedRef<Animated.ScrollView>) => (
    <NestableScrollContainerProvider
      forwardedRef={forwardedRef as AnimatedRef<Animated.ScrollView>}
    >
      <NestableScrollContainerInner {...props} />
    </NestableScrollContainerProvider>
  ),
);
