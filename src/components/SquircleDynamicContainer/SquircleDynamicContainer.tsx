import {
  Canvas,
  Path,
  processTransform3d,
  Skia,
  SkPath,
  usePathValue,
} from '@shopify/react-native-skia';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { SharedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { getSvgPath } from '@/utils/figma-squircle';
import { LayoutChangeEvent } from 'react-native/Libraries/Types/CoreEventTypes';

interface Props {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  shouldFill?: boolean;
  width?: number;
  height: number;
  showBorder?: boolean;
  children?: React.ReactNode;
  color?: string;
  animationDuration?: number;
}

const SquircleDynamicContainer = forwardRef<View, Props>(
  ({ width = 0, height, children, shouldFill, style, color, animationDuration = 0 }, ref) => {
    const { styles } = useStyles(stylesheet);

    const [defaultWidth, setDefaultWidth] = useState(width);

    const animatedWidth = useSharedValue(width);

    const handleLayout = useCallback(
      (e: LayoutChangeEvent) => {
        setDefaultWidth(e.nativeEvent.layout.width);
        animatedWidth.value = withTiming(e.nativeEvent.layout.width, {
          duration: animationDuration,
        });

        if (width === 0) {
          setDefaultWidth(e.nativeEvent.layout.width);
        }
      },
      [animatedWidth, animationDuration, width],
    );

    return (
      <Animated.View
        ref={ref}
        style={[
          style,
          {
            height,
          },
        ]}
      >
        <Squircle
          height={height}
          animatedWidth={animatedWidth}
          shouldFill={shouldFill}
          color={color}
          defaultWidth={defaultWidth}
        />
        <View style={styles.childContainer} onLayout={handleLayout}>
          {children}
        </View>
      </Animated.View>
    );
  },
);

const multiplier = 1.05;

interface SquircleProps {
  animatedWidth: SharedValue<number>;
  height: number;
  shouldFill?: boolean;
  color?: string;
  defaultWidth: number;
}

const Squircle = ({ animatedWidth, height, shouldFill, color, defaultWidth }: SquircleProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const path = useMemo(() => {
    const skPath = Skia.Path.MakeFromSVGString(
      getSvgPath({
        width: defaultWidth,
        height: height,
        cornerRadius: 12,
        cornerSmoothing: 1,
        preserveSmoothing: true, // defaults to false
      }),
    );
    return skPath || undefined;
  }, [defaultWidth, height]);

  const transformPath = useCallback(
    (pathValue: SkPath) => {
      'worklet';
      pathValue.transform(
        processTransform3d([
          { scaleX: animatedWidth.value / defaultWidth },
          { translateY: 1 },
          { translateX: 1 },
        ]),
      );
    },
    [animatedWidth, defaultWidth],
  );

  const clip = usePathValue(transformPath, path);

  const canvasStyle = useMemo(
    () => ({
      height: height * multiplier,
      width: defaultWidth * multiplier,
    }),
    [defaultWidth, height],
  );
  return (
    <View style={styles.squircleContainer}>
      <Canvas style={canvasStyle}>
        <Path
          antiAlias={true}
          style={shouldFill ? 'fill' : 'stroke'}
          strokeWidth={1}
          color={color || theme.colors.primary}
          path={clip}
        />
      </Canvas>
    </View>
  );
};

const stylesheet = createStyleSheet(() => ({
  squircleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  childContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // We do this to match translateY and translateX
    top: 1,
    left: 1,
  },
}));

export default SquircleDynamicContainer;
