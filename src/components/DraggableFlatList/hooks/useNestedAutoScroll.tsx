import {
  DerivedValue,
  scrollTo,
  useAnimatedReaction,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeNestableScrollContainerContext } from '../context/nestableScrollContainerContext';
import { SCROLL_POSITION_TOLERANCE } from '../constants';
import { useAnimatedValues } from '../context/animatedValueContext';

const autoscrollSpeed = 100;
const autoscrollThreshold = 30;

export function useNestedAutoScroll({ hoverOffset }: { hoverOffset: DerivedValue<number> }) {
  const { containerSize, scrollableRef, scrollViewSize } = useSafeNestableScrollContainerContext();

  const outerScrollOffset = useScrollViewOffset(scrollableRef);

  const DUMMY_VAL = useSharedValue(0);

  const {
    activeCellSize = DUMMY_VAL,
    isDraggingCell = DUMMY_VAL,
    isTouchActiveNative = DUMMY_VAL,
  } = useAnimatedValues();

  const hoverScreenOffset = useDerivedValue(() => {
    return hoverOffset.value - outerScrollOffset.value;
  }, []);

  const isScrolledUp = useDerivedValue(() => {
    return outerScrollOffset.value - SCROLL_POSITION_TOLERANCE <= 0;
  }, []);

  const isScrolledDown = useDerivedValue(() => {
    return (
      outerScrollOffset.value + containerSize.value + SCROLL_POSITION_TOLERANCE >=
      scrollViewSize.value
    );
  }, []);

  const distToTopEdge = useDerivedValue(() => {
    return Math.max(0, hoverScreenOffset.value);
  }, [hoverScreenOffset]);

  const distToBottomEdge = useDerivedValue(() => {
    const dist = containerSize.value - (hoverScreenOffset.value + activeCellSize.value);
    return Math.max(0, dist);
  }, [hoverScreenOffset, activeCellSize, containerSize]);

  const isAtTopEdge = useDerivedValue(() => {
    return distToTopEdge.value <= autoscrollThreshold;
  }, []);

  const isAtBottomEdge = useDerivedValue(() => {
    return distToBottomEdge.value <= autoscrollThreshold;
  });

  const scrollTarget = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return isDraggingCell.value;
    },
    (cur, prev) => {
      if (cur && !prev) {
        scrollTarget.value = outerScrollOffset.value;
      }
    },
    [activeCellSize]
  );

  useDerivedValue(() => {
    const isAtEdge = isAtTopEdge.value || isAtBottomEdge.value;
    const topDisabled = isAtTopEdge.value && isScrolledUp.value;
    const bottomDisabled = isAtBottomEdge.value && isScrolledDown.value;
    const isEdgeDisabled = topDisabled || bottomDisabled;

    const scrollTargetDiff = Math.abs(scrollTarget.value - outerScrollOffset.value);
    const scrollInProgress = scrollTargetDiff > SCROLL_POSITION_TOLERANCE;

    const shouldScroll =
      isAtEdge &&
      !isEdgeDisabled &&
      isDraggingCell.value &&
      isTouchActiveNative.value &&
      !scrollInProgress;

    const distFromEdge = isAtTopEdge.value ? distToTopEdge.value : distToBottomEdge.value;
    const speedPct = 1 - distFromEdge / autoscrollThreshold;
    const offset = speedPct * autoscrollSpeed;
    const targetOffset = isAtTopEdge.value
      ? Math.max(0, outerScrollOffset.value - offset)
      : outerScrollOffset.value + offset;
    if (shouldScroll) {
      scrollTarget.value = targetOffset;
      scrollTo(scrollableRef, 0, targetOffset, true);
    }
  }, [autoscrollSpeed, autoscrollThreshold, isDraggingCell]);

  return null;
}
