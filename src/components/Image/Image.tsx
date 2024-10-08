import React, { useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { FasterImageView, FasterImageProps } from '@candlefinance/faster-image';
import images from '@/theme/images';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export type ImgProps = Omit<FasterImageProps, 'source'> & {
  className?: string;
  height?: number;
  width?: number;
  placeholder?: string;
  style?: any;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  source?:
    | ({
        url?: string;
        uri?: string | null;
      } & Omit<FasterImageProps['source'], 'url'>)
    | null;
};

const AnimatedImage = Animated.createAnimatedComponent(FasterImageView);

const Image = ({ style, source, ...props }: ImgProps) => {
  const imageUri = useMemo(() => source?.url || source?.uri || '', [source]);
  const { styles } = useStyles(stylesheet);
  return (
    <AnimatedImage
      style={[style, styles.container]}
      source={{
        cachePolicy: 'discWithCacheControl',
        url: imageUri || images.PLACEHOLDER_IMAGE,
        resizeMode: 'cover',
        showActivityIndicator: true,
        transitionDuration: 0.3,
        progressiveLoadingEnabled: true,
        ...source,
        failureImage: images.PLACEHOLDER_IMAGE,
      }}
      {...props}
    />
  );
};

const stylesheet = createStyleSheet(() => ({
  container: {
    overflow: 'hidden',
  },
}));

export default Image;
