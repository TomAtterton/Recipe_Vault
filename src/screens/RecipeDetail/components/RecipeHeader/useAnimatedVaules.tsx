/* eslint-disable */
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import { interpolate, useAnimatedStyle } from 'react-native-reanimated';

const useAnimatedValues = (isAnimated: boolean) => {
  const { goBack } = useNavigation();
  const { top } = useSafeAreaInsets();

  if (!isAnimated) {
    return {
      animatedStyle: {},
      animatedImageScaleStyle: {},
      animatedNavBarStyle: {},
      RECIPE_HEADER_HEIGHT: 0,
      scrollY: { value: 0 },
      goBack,
      top,
    };
  }

  const { height } = useWindowDimensions();

  const RECIPE_HEADER_HEIGHT = height / 2.8 + height / 4;

  const scrollY = useCurrentTabScrollY();

  const animatedStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(scrollY.value, [0, RECIPE_HEADER_HEIGHT / 1.5], [1, 0]);
    return {
      opacity: interpolatedOpacity,
    };
  });

  const animatedImageScaleStyle = useAnimatedStyle(() => {
    const interpolatedScale = interpolate(
      scrollY.value,
      [-RECIPE_HEADER_HEIGHT, 0, RECIPE_HEADER_HEIGHT],
      [1.5, 1, 1]
    );
    const translateY = interpolate(
      scrollY.value,
      [-RECIPE_HEADER_HEIGHT, 0, RECIPE_HEADER_HEIGHT],
      [-RECIPE_HEADER_HEIGHT, 0, 0]
    );

    return {
      transform: [{ scale: interpolatedScale }, { translateY }],
      position: 'absolute',
      top: 0,
      left: 0,
    };
  });

  const animatedNavBarStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-RECIPE_HEADER_HEIGHT, 0, RECIPE_HEADER_HEIGHT],
      [-RECIPE_HEADER_HEIGHT, 0, 0]
    );

    return {
      transform: [{ translateY }],
    };
  });

  return {
    animatedStyle,
    animatedImageScaleStyle,
    animatedNavBarStyle,
    goBack,
    top,
  };
};
export default useAnimatedValues;
