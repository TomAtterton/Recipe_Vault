import { Canvas, Path, processTransform3d, Skia, usePathValue } from '@shopify/react-native-skia';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { getSvgPath } from '@/utils/figma-squircle';
import { LayoutChangeEvent } from 'react-native/Libraries/Types/CoreEventTypes';

interface Props {
  style?: any;
  contentContainerStyle?: any;
  shouldFill?: boolean;
  aniWidth?: { value: number };
  width: number;
  height: number;
  showBorder?: boolean;
  children?: React.ReactNode;
  x?: number;
  y?: number;
  cornerRadius?: number;
  color?: string;
}

const SquircleContainer = ({ width, height, showBorder, cornerRadius, color, children }: Props) => {
  return (
    <Canvas
      style={{
        height: height * 1.05,
        width: width * 1.05,
        overflow: 'visible',
      }}
    >
      <Squircle
        width={width}
        height={height}
        showBorder={showBorder}
        color={color}
        cornerRadius={cornerRadius}
      />
      {children}
    </Canvas>
  );
};

export const SquircleContentContainer = forwardRef<View, Props>(
  ({ width, height, aniWidth, children, shouldFill, contentContainerStyle, style }, ref) => {
    const { theme } = useStyles();

    const path = useMemo(() => {
      return Skia.Path.MakeFromSVGString(
        getSvgPath({
          width: width || 0,
          height: height || 0,
          cornerRadius: 12,
          cornerSmoothing: 1,
          preserveSmoothing: true, // defaults to false
        })
      );
    }, [height, width]);

    const animatedWidth = useSharedValue(width || 0);
    const animatedHeight = useSharedValue(height || 0);

    const clip = usePathValue((pathValue) => {
      'worklet';
      pathValue.transform(
        processTransform3d([
          { scaleX: aniWidth?.value ? aniWidth.value / width : animatedWidth.value / width },
          // TODO support dynamic height
          // {
          //   scaleY: supportDynamicHeight
          //     ? aniHeight?.value
          //       ? aniHeight.value / height
          //       : animatedHeight.value / height
          //     : height / height,
          // },
          { translateY: 1 },
          { translateX: 1 },
        ])
      );
      // @ts-ignore
    }, path);

    const handleLayout = useCallback(
      (e: LayoutChangeEvent) => {
        animatedWidth.value = withTiming(e.nativeEvent.layout.width, { duration: 400 });
        animatedHeight.value = withTiming(e.nativeEvent.layout.height, { duration: 400 });
      },
      [animatedHeight, animatedWidth]
    );

    return (
      <View
        ref={ref}
        style={[
          {
            flex: 1,
          },
          style,
        ]}
        onLayout={handleLayout}
      >
        <Canvas
          style={{
            height: height * 1.05,
            width: width * 1.05,
          }}
        >
          <Path
            antiAlias={true}
            style={shouldFill ? 'fill' : 'stroke'}
            strokeWidth={1}
            color={shouldFill ? theme.colors.primary : theme.colors.onBackground}
            path={clip}
          />
        </Canvas>
        <View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      </View>
    );
  }
);

export const Squircle = ({ width, height, cornerRadius = 10, x, y, showBorder, color }: Props) => {
  const { theme } = useStyles();
  const svgPath = getSvgPath({
    width: width,
    height: height,
    cornerRadius: cornerRadius,
    cornerSmoothing: 1,
    preserveSmoothing: true, // defaults to false
  });

  return (
    <Path
      antiAlias={true}
      style={showBorder ? 'stroke' : 'fill'}
      strokeWidth={showBorder ? 2 : 0}
      transform={[
        {
          translateX: x || width * 0.02,
        },
        {
          translateY: y || height * 0.02,
        },
      ]}
      color={color || theme.colors.onBackground}
      path={svgPath}
    />
  );
};

export default SquircleContainer;
