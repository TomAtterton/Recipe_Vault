import React, { useCallback } from 'react';
import { ListRenderItemInfo, StyleProp, View, ViewStyle } from 'react-native';

import styles from './cardCarousel.style';
import Carousel, { CarouselProps } from '@/screens/Home/components/Carousel/Carousel';
import TitleContent from '@/screens/Home/components/CardCarousel/components/TitleContent';
import Shimmer from 'src/components/Shimmer';

export interface CardCarouselProps<T> extends CarouselProps<T> {
  style?: StyleProp<ViewStyle>;
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  isLoading?: boolean;
  shimmerSize: {
    height: number;
    width: number;
  };
  EmptyComponent?: React.FunctionComponent;
}

const loadingArray = Array.from({ length: 5 });

const CardCarousel = <T,>({
  style,
  keyExtractor,
  title,
  onSeeAll,
  data,
  renderItem,
  isLoading,
  showSeeAll,
  itemWidth,
  shimmerSize,
  contentContainerStyle,
  EmptyComponent,
  ...carouselProps
}: CardCarouselProps<T>) => {
  const handleRenderItem = useCallback(
    (info: ListRenderItemInfo<T>) => {
      return isLoading ? (
        <Shimmer style={styles.shimmer} width={shimmerSize.width} height={shimmerSize.height} />
      ) : (
        (renderItem?.(info) ?? null)
      );
    },
    [isLoading, renderItem, shimmerSize.height, shimmerSize.width],
  );

  // @ts-ignore
  const hasData = data?.length > 0;

  return (
    <View style={style}>
      {isLoading ? (
        <View style={styles.shimmerContainer}>
          <Shimmer width={150} height={20} style={styles.shimmer} />
          <Shimmer width={80} height={20} style={styles.shimmer} />
        </View>
      ) : (
        hasData && <TitleContent title={title} showSeeAll={showSeeAll} onSeeAll={onSeeAll} />
      )}
      <Carousel
        keyExtractor={keyExtractor}
        style={styles.carousel}
        data={isLoading ? (loadingArray as T[]) : data}
        renderItem={handleRenderItem}
        itemWidth={itemWidth}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        {...carouselProps}
      />
      <View style={styles.contentContainer}>
        {data?.length === 0 && !isLoading && EmptyComponent && <EmptyComponent />}
      </View>
    </View>
  );
};

export default CardCarousel;
