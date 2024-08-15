import { Gesture, PanGestureHandlerProperties } from 'react-native-gesture-handler';
import { runOnJS, withSpring } from 'react-native-reanimated';
import { useAnimatedValues } from '../context/animatedValueContext';
import { animConfig } from '@/components/DraggableFlatList/constants';

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
      isTouchActiveNative.value = false;
      const translation = evt.translationY;
      touchTranslate.value = translation + autoScrollDistance.value;

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
      if (disabled.value) return;
      isTouchActiveNative.value = !disabled.value;
    })
    .onTouchesUp(() => {
      if (disabled.value) return;
      isTouchActiveNative.value = false;
    });

  return {
    panGesture,
  };
};

export default useHandlePan;
