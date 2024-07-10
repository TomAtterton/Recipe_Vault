import React, { memo, useEffect, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import { stylesheet } from './shimmer.style';
import { useStyles } from 'react-native-unistyles';

interface Props {
  style?: ViewStyle;
  show?: boolean;
  height?: number;
  width?: number;
  isImage?: boolean;
}

const Shimmer = ({ style, height = 0, width = 0, isImage }: Props) => {
  const progress = useSharedValue(0);
  const { styles, theme } = useStyles(stylesheet);
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.linear }), Infinity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [-width, width]),
      },
    ],
  }));

  const additionalStyles = useMemo((): ViewStyle => {
    const imageStyle = isImage
      ? ({
          position: 'absolute',
          top: 0,
        } as ViewStyle)
      : {};
    return {
      height,
      width,
      backgroundColor: theme.colors.placeholder,
      ...imageStyle,
    };
  }, [height, isImage, theme.colors.placeholder, width]);

  // const colors = ['#ebebeb', '#c5c5c5', '#ebebeb'];
  const colors = [
    theme.colors.lightBackground20, // Use the placeholder color from darkColors
    theme.colors.lightBackground60, // Use a light background color with 60% opacity
    theme.colors.background40, // Use a dark background color with 40% opacity
  ];
  return (
    <View style={[styles.containerContent, style, additionalStyles]}>
      <Animated.View style={[styles.containerShimmer, animatedStyle]}>
        <LinearGradient
          // make the colors darker
          colors={colors}
          style={{ height, width }}
          start={{
            x: -1,
            y: 0.5,
          }}
          end={{
            x: 2,
            y: 0.5,
          }}
          locations={[0.3, 0.5, 0.7]}
        />
      </Animated.View>
    </View>
  );
};

export default memo(Shimmer);
