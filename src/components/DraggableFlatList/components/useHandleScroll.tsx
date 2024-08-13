import { DerivedValue, useDerivedValue } from 'react-native-reanimated';
import { useAnimatedValues } from '../context/animatedValueContext';
import { useNestedAutoScroll } from '@/components/DraggableFlatList/hooks/useNestedAutoScroll';

const useHandleScroll = (listVerticalOffset: DerivedValue<number>) => {
  const { hoverOffset } = useAnimatedValues();

  const verticalOffset = useDerivedValue(() => {
    return hoverOffset.value + listVerticalOffset.value;
  }, [hoverOffset]);

  useNestedAutoScroll({
    hoverOffset: verticalOffset,
  });
};

export default useHandleScroll;
