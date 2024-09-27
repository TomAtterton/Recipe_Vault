import { useWindowDimensions } from 'react-native';
import { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

const minScale = 1;
const maxScale = 5;

interface Props {
  isSelecting: SharedValue<number>;
  scaledImageHeight: number;
  imageUri: string;
}

export const clamp = (value: number, min: number, max: number): number => {
  'worklet';

  return Math.min(Math.max(min, value), max);
};

const useImageScaleGestures = ({ isSelecting, scaledImageHeight }: Props) => {
  const { width } = useWindowDimensions();

  const scale = useSharedValue(1);
  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const focal = { x: useSharedValue(0), y: useSharedValue(0) };
  const translate = { x: useSharedValue(0), y: useSharedValue(0) };
  const lastTranslate = { x: useSharedValue(0), y: useSharedValue(0) };
  const lastScale = useSharedValue(1); // Store the last scale
  const center = { x: width / 2, y: scaledImageHeight / 2 };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (isSelecting.value === 1) {
        return;
      }
      // On start of the gesture, set translate to last known values
      translate.x.value = lastTranslate.x.value;
      translate.y.value = lastTranslate.y.value;
    })
    .onUpdate((event) => {
      if (isSelecting.value === 1) {
        return;
      }

      // Update the translate values based on the gesture movement
      translate.x.value = lastTranslate.x.value + event.translationX;
      translate.y.value = lastTranslate.y.value + event.translationY;
    })
    .onEnd(() => {
      if (isSelecting.value === 1) {
        return;
      }
      // On end of the gesture, store the last translation values
      lastTranslate.x.value = translate.x.value;
      lastTranslate.y.value = translate.y.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      if (isSelecting.value === 1) {
        return;
      }
      // Store the initial focal point when the gesture starts
      initialFocal.x.value = event.focalX;
      initialFocal.y.value = event.focalY;

      // Use the last scale value to initialize the scale
      scale.value = lastScale.value;
    })
    .onUpdate((event) => {
      if (isSelecting.value === 1) {
        return;
      }
      // Update the scale value based on the gesture
      scale.value = clamp(lastScale.value * event.scale, minScale, maxScale);

      // Adjust the focal point based on the initial focal point and the center
      focal.x.value = (center.x - initialFocal.x.value) * (scale.value - 1);
      focal.y.value = (center.y - initialFocal.y.value) * (scale.value - 1);
    })
    .onEnd(() => {
      if (isSelecting.value === 1) {
        return;
      }
      // Store the last scale value when the gesture ends
      lastScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translate.x.value },
      { translateY: translate.y.value },
      { translateX: focal.x.value },
      { translateY: focal.y.value },
      { scale: scale.value },
    ],
  }));

  return {
    animatedStyle,
    panGesture,
    pinchGesture,
  };
};

export default useImageScaleGestures;
