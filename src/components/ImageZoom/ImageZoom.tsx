import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { useGestures } from './hooks/useGestures';

import type { ImageZoomProps } from './types';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import { useImageLayout } from '@/components/ImageZoom/hooks/useImageLayout';

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

const ImageZoom: React.FC<ImageZoomProps> = ({
  uri = '',
  minScale,
  maxScale,
  onLayout,
  style = {},
}) => {
  const { center, onImageLayout } = useImageLayout({ onLayout });

  const { animatedStyle, gestures } = useGestures({
    center,
    minScale,
    maxScale,
  });

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[styles.image, style, animatedStyle]}>
        <Image
          style={styles.image}
          cachePolicy={'none'}
          enableLiveTextInteraction={true}
          source={{ uri }}
          contentFit={'contain'}
          onLayout={onImageLayout}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default ImageZoom;
