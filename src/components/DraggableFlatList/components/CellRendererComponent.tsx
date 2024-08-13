import React, { memo, useMemo } from 'react';
import {
  LayoutChangeEvent,
  MeasureLayoutOnSuccessCallback,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useCellTranslate } from '../hooks/useCellTranslate';
import { useRefs } from '../context/refContext';
import { useStableCallback } from '../hooks/useStableCallback';

type Props<T> = {
  item: T;
  index: number;
  children: React.ReactNode;
  onLayout?: (e: LayoutChangeEvent) => void;
  style?: StyleProp<ViewStyle>;
  keyExtractor: (item: T, index: number) => string;
  activeKey: string | null;
};

function CellRendererComponent<T>({
  keyExtractor,
  activeKey,
  style,
  item,
  index,
  onLayout,
  children,
  ...props
}: Props<T>) {
  const viewRef = useAnimatedRef<Animated.View>();

  const { cellDataRef, propsRef, containerRef } = useRefs<T>();

  const key = useMemo(() => keyExtractor(item, index), [item, index, keyExtractor]);

  const offset = useSharedValue(-1);
  const size = useSharedValue(-1);
  const heldTanslate = useSharedValue(0);

  const translate = useCellTranslate({
    cellOffset: offset,
    cellSize: size,
    cellIndex: index,
    activeKey,
  });

  const animStyle = useAnimatedStyle(() => {
    if (activeKey === null) {
      return styles.zeroTranslate;
    }

    const isActive = activeKey === key;
    const t = activeKey ? translate.value : heldTanslate.value;

    return {
      transform: [{ translateY: t }],
      elevation: isActive ? 1 : 0,
      zIndex: isActive ? 999 : 0,
    };
  }, [activeKey, translate, heldTanslate, key]);

  const onCellLayout = useStableCallback((e?: LayoutChangeEvent) => {
    heldTanslate.value = 0;

    const onSuccess: MeasureLayoutOnSuccessCallback = (x, y, w, h) => {
      // if (isWeb && horizontal) x += scrollOffset.value;
      const cellOffset = y;
      const cellSize = h;
      cellDataRef.current.set(key, {
        measurements: { size: cellSize, offset: cellOffset },
      });

      size.value = cellSize;
      offset.value = cellOffset;
    };

    const onFail = () => {
      if (propsRef.current?.debug) {
        console.log(`## on measure fail, index: ${index}`);
      }
    };

    const containerNode = containerRef.current;
    const viewNode = viewRef.current;
    const nodeHandle = containerNode;

    if (viewNode && nodeHandle) {
      //@ts-ignore
      viewNode.measureLayout(nodeHandle, onSuccess, onFail);
    }

    if (onLayout && e) onLayout(e);
  });

  return (
    <Animated.View
      {...props}
      ref={viewRef}
      onLayout={onCellLayout}
      style={[style, animStyle]}
      pointerEvents={activeKey ? 'none' : 'auto'}
    >
      {children}
    </Animated.View>
  );
}

export default memo(CellRendererComponent);

const styles = StyleSheet.create({
  zeroTranslate: {
    transform: [{ translateX: 0 }, { translateY: 0 }],
  },
});
