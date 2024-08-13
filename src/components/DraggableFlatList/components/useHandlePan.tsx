import { Gesture, PanGestureHandlerProperties } from 'react-native-gesture-handler';
import { runOnJS, withSpring } from 'react-native-reanimated';
import { useAnimatedValues } from '../context/animatedValueContext';
import { animConfig } from '@/components/DraggableFlatList/constants'; // Ensure this import

const useHandlePan = ({
  dragHitSlop,
  activationDistanceProp,
  handleDragEnd,
}: {
  dragHitSlop: PanGestureHandlerProperties['hitSlop'];
  activationDistanceProp: number;
  handleDragEnd: (args: { from: number; to: number }) => void;
}) => {
  const {
    activeCellOffset,
    activeIndexAnim,
    spacerIndexAnim,
    placeholderOffset,
    touchTranslate,
    autoScrollDistance,
    isTouchActiveNative,
    disabled,
  } = useAnimatedValues();

  const panGesture = Gesture.Pan()
    .enabled(!disabled.value)
    .hitSlop(dragHitSlop)
    .activeOffsetY([-activationDistanceProp, activationDistanceProp])
    .onUpdate((evt) => {
      touchTranslate.value = evt.translationY;
    })
    .onEnd((evt) => {
      // Set touch val to current translate val
      isTouchActiveNative.value = false;
      const translation = evt.translationY;
      touchTranslate.value = translation + autoScrollDistance.value;

      // Only call onDragEnd if actually dragging a cell
      if (activeIndexAnim.value === -1 || disabled.value) return;
      disabled.value = true;
      const springTo = placeholderOffset.value - activeCellOffset.value;
      touchTranslate.value = withSpring(springTo, animConfig, () => {
        runOnJS(handleDragEnd)({
          from: activeIndexAnim.value,
          to: spacerIndexAnim.value,
        });
        disabled.value = false;
      });
    })
    .onTouchesDown(() => {
      if (!disabled.value) {
        isTouchActiveNative.value = true;
      } else {
        isTouchActiveNative.value = false;
      }
      return false;
    })
    .onTouchesUp(() => {
      isTouchActiveNative.value = false;
    });

  return {
    panGesture,
  };
};

export default useHandlePan;
