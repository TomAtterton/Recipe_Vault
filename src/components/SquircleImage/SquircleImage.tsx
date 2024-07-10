import { Canvas, Rect } from '@shopify/react-native-skia';

import React, { useMemo } from 'react';
import { getSvgPath } from 'figma-squircle';
import { View } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import Image from '@/components/Image';
import { ImgProps } from '@/components/Image/Image';

interface Props extends Omit<ImgProps, 'style'> {
  width: number;
  height: number;
  cornerRadius?: number;
}

const SquircleImage = ({ width, height, cornerRadius, ...props }: Props) => {
  const svgPath = useMemo(
    () =>
      getSvgPath({
        width,
        height,
        cornerRadius: cornerRadius || 20,
        cornerSmoothing: 1,
        preserveSmoothing: true, // defaults to false
      }),
    [width, height, cornerRadius]
  );

  const { theme } = useStyles();

  const imageStyle = useMemo(
    () => ({
      width: width,
      height,
      position: 'absolute',
      overflow: 'hidden',
    }),
    [width, height]
  );
  const canvasStyle = useMemo(
    () => ({
      width: width * 1.05,
      height: height * 1.05,
    }),
    [width, height]
  );

  return (
    <View>
      {/*// @ts-ignore*/}
      <Image style={[imageStyle, props.style]} height={height} width={width} {...props} />
      <Canvas style={canvasStyle}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          color={theme.colors.background}
          clip={svgPath}
          invertClip={true}
        />
      </Canvas>
    </View>
  );
};

export default SquircleImage;
