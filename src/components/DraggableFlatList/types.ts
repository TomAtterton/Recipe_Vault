import React from 'react';
import { FlatListProps, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { useAnimatedValues } from './context/animatedValueContext';
import Animated, { SharedValue, WithSpringConfig } from 'react-native-reanimated';
import { DEFAULT_PROPS } from './constants';

export type DragEndParams = {
  from: number;
  to: number;
};
type Modify<T, R> = Omit<T, keyof R> & Partial<R>;

type DefaultProps = Readonly<typeof DEFAULT_PROPS>;

export type DraggableFlatListProps<T> = Modify<
  FlatListProps<T>,
  {
    data: T[];
    activationDistance?: number;
    animationConfig?: Partial<WithSpringConfig>;
    autoscrollSpeed?: number;
    autoscrollThreshold?: number;
    containerStyle?: StyleProp<ViewStyle>;
    debug?: boolean;
    dragItemOverflow?: boolean;
    keyExtractor: (_item: T, _index: number) => string;
    onDragBegin?: (_index: number) => void;
    onDragEnd?: (_params: DragEndParams) => void;
    onPlaceholderIndexChange?: (_placeholderIndex: number) => void;
    onRelease?: (_index: number) => void;
    onScrollOffsetChange?: (_scrollOffset: number) => void;
    renderItem: RenderItem<T>;
    renderPlaceholder?: RenderPlaceholder<T>;
    simultaneousHandlers?: React.Ref<any> | React.Ref<any>[];
    outerScrollOffset?: SharedValue<number>;
    onAnimValInit?: (_animVals: ReturnType<typeof useAnimatedValues>) => void;
    onContainerLayout?: (_params: {
      layout: LayoutChangeEvent['nativeEvent']['layout'];
      containerRef: React.RefObject<Animated.View>;
    }) => void;
  } & Partial<DefaultProps>
>;

export type RenderPlaceholder<T> = (_params: { _item: T; _index: number }) => JSX.Element;

export type RenderItemParams<T> = {
  item: T;
  getIndex: () => number | undefined;
  drag: () => void;
  isActive: boolean;
};

export type RenderItem<T> = (_params: RenderItemParams<T>) => React.ReactNode;

export type CellData = {
  measurements: {
    size: number;
    offset: number;
  };
};
