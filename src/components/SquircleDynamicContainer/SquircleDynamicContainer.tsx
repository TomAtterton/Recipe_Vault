import { Canvas, Path, processTransform3d, Skia, usePathValue } from '@shopify/react-native-skia';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { getSvgPath } from '@/utils/figma-squircle';
import { LayoutChangeEvent } from 'react-native/Libraries/Types/CoreEventTypes';

interface Props {
  style?: any;
  contentContainerStyle?: any;
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
      [animatedWidth, animationDuration, width]
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
  }
);

const multiplier = 1.05;

const Squircle = ({
  animatedWidth,
  height,
  shouldFill,
  color,
  defaultWidth,
}: {
  animatedWidth: any;
  height: number;
  shouldFill?: boolean;
  color?: string;
  defaultWidth: number;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const path = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        getSvgPath({
          width: defaultWidth,
          height: height,
          cornerRadius: 12,
          cornerSmoothing: 1,
          preserveSmoothing: true, // defaults to false
        })
      ),
    [defaultWidth, height]
  );

  const clip = usePathValue((pathValue) => {
    'worklet';
    pathValue.transform(
      processTransform3d([
        { scaleX: animatedWidth.value / defaultWidth },
        { translateY: 1 },
        { translateX: 1 },
      ])
    );
    // @ts-ignore
  }, path);

  const canvasStyle = useMemo(
    () => ({
      height: height * multiplier,
      width: defaultWidth * multiplier,
    }),
    [defaultWidth, height]
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
