import { interpolate, useAnimatedStyle, withTiming, SharedValue } from 'react-native-reanimated';
import { Directions, Gesture } from 'react-native-gesture-handler';
import { useWindowDimensions } from 'react-native';

const useIngredientBottomSheetAnimations = (sheetHeight: SharedValue<number>) => {
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const MIN_SHEET_HEIGHT = screenHeight * 0.1;
  const MID_SHEET_HEIGHT = screenHeight * 0.4;
  const MAX_SHEET_HEIGHT = screenHeight * 0.8;

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(sheetHeight.value, { duration: 300 }),
    };
  });

  const animatedMenuViewStyle = useAnimatedStyle(() => {
    const opacity = interpolate(sheetHeight.value, [MIN_SHEET_HEIGHT, MID_SHEET_HEIGHT], [0, 1]);
    return {
      opacity: withTiming(opacity, { duration: 300 }),
    };
  });

  const animatedIngredientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(sheetHeight.value, [MIN_SHEET_HEIGHT, MID_SHEET_HEIGHT], [1, 0]);
    return {
      opacity: withTiming(opacity, { duration: 300 }),
    };
  });

  const animatedPaginationStyle = useAnimatedStyle(() => {
    const opacity = interpolate(sheetHeight.value, [MID_SHEET_HEIGHT, MAX_SHEET_HEIGHT], [1, 0]);
    return {
      opacity: withTiming(opacity, { duration: 300 }),
      bottom: withTiming(sheetHeight.value, { duration: 300 }),
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(sheetHeight.value, [MID_SHEET_HEIGHT, MAX_SHEET_HEIGHT], [0, 0.5]);
    const width = interpolate(
      sheetHeight.value,
      [MIN_SHEET_HEIGHT, MID_SHEET_HEIGHT, MAX_SHEET_HEIGHT],
      [0, 0, screenWidth],
    );

    const height = interpolate(
      sheetHeight.value,
      [MIN_SHEET_HEIGHT, MID_SHEET_HEIGHT, MAX_SHEET_HEIGHT],
      [0, 0, screenHeight],
    );
    return {
      opacity: withTiming(opacity, { duration: 300 }),
      width: width,
      height: withTiming(height, { duration: 300 }),
    };
  });

  // Gesture to expand the sheet
  const flingGestureUp = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => {
      if (sheetHeight.value === MIN_SHEET_HEIGHT) {
        sheetHeight.value = MID_SHEET_HEIGHT;
        return;
      }

      sheetHeight.value = MAX_SHEET_HEIGHT;
    });

  // Gesture to collapse the sheet
  const flingGestureDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(() => {
      if (sheetHeight.value === MAX_SHEET_HEIGHT) {
        sheetHeight.value = MID_SHEET_HEIGHT;
        return;
      }

      sheetHeight.value = MIN_SHEET_HEIGHT;
    });

  const touchDownGesture = Gesture.Tap().onEnd(() => {
    if (sheetHeight.value === MIN_SHEET_HEIGHT) {
      sheetHeight.value = MID_SHEET_HEIGHT;
      return;
    }
  });

  const gestures = Gesture.Simultaneous(flingGestureUp, flingGestureDown, touchDownGesture);

  const handleDismiss = () => {
    sheetHeight.value = MIN_SHEET_HEIGHT;
  };
  return {
    animatedSheetStyle,
    animatedMenuViewStyle,
    animatedIngredientStyle,
    animatedPaginationStyle,
    animatedBackdropStyle,
    gestures,
    handleDismiss,
  };
};

export default useIngredientBottomSheetAnimations;
