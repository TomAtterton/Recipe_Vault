import React, { useMemo } from 'react';
import { FlatList, FlatListProps } from 'react-native';

export interface CarouselProps<T> extends FlatListProps<T> {
  data: T[] | null | undefined;
  keyExtractor: FlatListProps<T>['keyExtractor'];
  itemWidth: number;
  shouldSnap?: boolean;
  gap?: number;
}

const Carousel = <T,>({
  keyExtractor,
  data,
  itemWidth,
  renderItem,
  shouldSnap = true,
  gap = 16,
  ...props
}: CarouselProps<T>) => {
  const snapPoints = useMemo(
    () => data?.map((_, i) => i * (itemWidth + gap)),
    [data, gap, itemWidth],
  );

  return (
    <FlatList
      keyExtractor={keyExtractor}
      horizontal
      data={data}
      renderItem={renderItem}
      decelerationRate="fast"
      snapToOffsets={shouldSnap ? snapPoints : undefined}
      showsHorizontalScrollIndicator={false}
      {...props}
      contentContainerStyle={[props.contentContainerStyle, { gap }]}
    />
  );
};

export default Carousel;
