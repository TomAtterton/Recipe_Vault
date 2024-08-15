import React, { useCallback, useLayoutEffect, useState } from 'react';
import { ListRenderItem, FlatListProps, LayoutChangeEvent, FlatList } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import CellRendererComponent from './CellRendererComponent';
import { DEFAULT_PROPS } from '../constants';
import RowItem from './RowItem';
import { DraggableFlatListProps } from '../types';
import PropsProvider from '../context/propsContext';
import AnimatedValueProvider, { useAnimatedValues } from '../context/animatedValueContext';
import RefProvider, { useRefs } from '../context/refContext';
import { useStableCallback } from '../hooks/useStableCallback';
import { useSafeNestableScrollContainerContext } from '../context/nestableScrollContainerContext';
import useHandlePan from './useHandlePan';
import { typedMemo } from '@/components/DraggableFlatList/utils';
import useHandleScroll from '@/components/DraggableFlatList/components/useHandleScroll';

type RNGHFlatListProps<T> = Animated.AnimateProps<FlatListProps<T>>;

type OnViewableItemsChangedCallback<T> = Exclude<
  FlatListProps<T>['onViewableItemsChanged'],
  undefined | null
>;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as unknown as <T>(
  props: RNGHFlatListProps<T>
) => React.ReactElement;

function DraggableFlatListInner<T>(props: DraggableFlatListProps<T>) {
  const { cellDataRef, containerRef, keyToIndexRef } = useRefs<T>();
  const {
    activeCellOffset,
    activeCellSize,
    activeIndexAnim,
    containerSize,
    scrollViewSize,
    spacerIndexAnim,
    touchTranslate,
    viewableIndexMin,
    viewableIndexMax,
    disabled,
  } = useAnimatedValues();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const currentKey = useSharedValue<string | null>(null);

  const { scrollableRef: outerScrollableRef, outerScrollEnabled } =
    useSafeNestableScrollContainerContext();
  const listVerticalOffset = useSharedValue(0);
  useHandleScroll(listVerticalOffset);

  const handleDragBegin: DraggableFlatListProps<T>['onDragBegin'] = useStableCallback(() => {
    outerScrollEnabled.value = false;
  });

  const handleDragEnd: DraggableFlatListProps<T>['onDragEnd'] = useStableCallback((params) => {
    outerScrollEnabled.value = true;
    setActiveKey(null);
    currentKey.value = null;
    activeIndexAnim.value = -1;
    spacerIndexAnim.value = -1;
    touchTranslate.value = 0;
    activeCellSize.value = -1;
    activeCellOffset.value = -1;
    props.onDragEnd?.(params);
  });

  const {
    dragHitSlop = DEFAULT_PROPS.dragHitSlop,
    activationDistance: activationDistanceProp = DEFAULT_PROPS.activationDistance,
  } = props;

  const keyExtractor = useStableCallback((item: T, index: number) => {
    if (!props.keyExtractor) {
      throw new Error('You must provide a keyExtractor to DraggableFlatList');
    }
    return props.keyExtractor(item, index);
  });

  useLayoutEffect(() => {
    props.data.forEach((d, i) => {
      const key = keyExtractor(d, i);
      keyToIndexRef.current.set(key, i);
    });
  }, [props.data, keyExtractor, keyToIndexRef]);

  const handleDrag = useStableCallback((newActiveKey: string) => {
    'worklet';
    if (disabled.value) return;
    const index = keyToIndexRef.current.get(newActiveKey);
    const cellData = cellDataRef.current.get(newActiveKey);
    if (cellData) {
      activeCellOffset.value = cellData.measurements.offset;
      activeCellSize.value = cellData.measurements.size;
    }

    if (index !== undefined) {
      spacerIndexAnim.value = index;
      activeIndexAnim.value = index;
      // setActiveKey(activeKey);
      currentKey.value = newActiveKey;
      setActiveKey(newActiveKey);
      handleDragBegin?.(index);
    }
  });

  const onLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    const { height } = layout;
    containerSize.value = height;
    const onSuccess = (_x: number, y: number) => {
      listVerticalOffset.value = y;
    };
    if (containerRef.current && outerScrollableRef.current) {
      // @ts-ignore
      containerRef.current.measureLayout(outerScrollableRef.current, onSuccess);
    }
  };

  const onListContentSizeChange = (w: number, h: number) => {
    scrollViewSize.value = props.horizontal ? w : h;
    props.onContentSizeChange?.(w, h);
  };

  const renderItem: ListRenderItem<T> = useCallback(
    ({ item, index }) => {
      const key = keyExtractor(item, index);
      if (index !== keyToIndexRef.current.get(key)) {
        keyToIndexRef.current.set(key, index);
      }

      return (
        <RowItem
          item={item}
          itemKey={key}
          renderItem={props.renderItem}
          drag={handleDrag}
          activeKey={activeKey}
        />
      );
    },
    [keyExtractor, keyToIndexRef, props.renderItem, handleDrag, activeKey]
  );

  const { panGesture } = useHandlePan({
    dragHitSlop,
    activationDistanceProp,
    handleDragEnd,
  });

  const onViewableItemsChanged = useStableCallback<OnViewableItemsChangedCallback<T>>((info) => {
    'worklet';
    const viewableIndices = info.viewableItems
      .filter((item) => item.isViewable)
      .map((item) => item.index)
      .filter((index): index is number => typeof index === 'number');

    const min = Math.min(...viewableIndices);
    const max = Math.max(...viewableIndices);
    viewableIndexMin.value = min;
    viewableIndexMax.value = max;
  });

  const handleCellRender = useCallback(
    (cellProps: any) => {
      return (
        <CellRendererComponent keyExtractor={keyExtractor} activeKey={activeKey} {...cellProps} />
      );
    },
    [activeKey, keyExtractor]
  );

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[props.containerStyle]} ref={containerRef} onLayout={onLayout}>
        <AnimatedFlatList
          {...props}
          data={props.data}
          onViewableItemsChanged={onViewableItemsChanged}
          CellRendererComponent={handleCellRender}
          onContentSizeChange={onListContentSizeChange}
          scrollEnabled={false}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          scrollEventThrottle={1}
          removeClippedSubviews={false}
          bounces={false}
          numColumns={1}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const MemoizedInner = typedMemo(DraggableFlatListInner);

function DraggableFlatList<T>(props: DraggableFlatListProps<T>) {
  return (
    <PropsProvider {...props}>
      <AnimatedValueProvider>
        <RefProvider>
          <MemoizedInner {...props} />
        </RefProvider>
      </AnimatedValueProvider>
    </PropsProvider>
  );
}

export default DraggableFlatList as <T>(
  props: DraggableFlatListProps<T>
) => ReturnType<typeof DraggableFlatList>;
