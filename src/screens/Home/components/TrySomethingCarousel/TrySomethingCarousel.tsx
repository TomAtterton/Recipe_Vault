import CardCarousel from '@/screens/Home/components/CardCarousel';
import React, { useCallback } from 'react';
import { RecipeDetailType } from '@/types';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import HomeAnimation from '@/screens/Home/homeAnimation';
import { stylesheet } from './trySomethingCarousel.style';
import useTrySomethingRecipe from '@/database/api/recipes/hooks/useTrySomethingRecipe';
import HorizontalCard from '@/components/cards/HorizontalCard';
import {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
} from '@/components/cards/HorizontalCard/horizontalCard.style';
import { View } from 'react-native';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import OutlineButton from '@/components/buttons/OutlineButton';
import { useStyles } from 'react-native-unistyles';
import { translate } from '@/core';

const keyExtractor = (_: Partial<RecipeDetailType>, index: number) =>
  `item-${(_?.id || '') + index}`;

const TrySomethingCarousel = ({ onSeeAll }: { onSeeAll: () => void }) => {
  const { data } = useTrySomethingRecipe();
  const { navigate } = useNavigation();

  const renderItem = useCallback(
    ({ item }: { item: Partial<RecipeDetailType> }) => {
      return (
        <HorizontalCard
          {...item}
          onPress={() =>
            item.id &&
            navigate(Routes.RecipeDetailStack, {
              screen: Routes.RecipeDetails,
              params: {
                id: item.id,
                image: item?.image || null,
              },
            })
          }
        />
      );
    },
    [navigate]
  );
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Animated.View style={styles.container} {...HomeAnimation.trySomethingCarousel}>
      <CardCarousel
        keyExtractor={keyExtractor}
        title={'try something new'}
        onSeeAll={onSeeAll}
        showSeeAll={true}
        shimmerSize={{ height: CONTAINER_HEIGHT / 1.5, width: CONTAINER_WIDTH }}
        data={data}
        renderItem={renderItem}
        itemWidth={CONTAINER_WIDTH}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name={'safe'} color={theme.colors.primary} size={32} />
            <Typography variant={'bodyMedium'}>{translate('home.empty.title')}</Typography>
            <OutlineButton
              title={translate('home.empty.button')}
              onPress={() => navigate(Routes.AddRecipe, {})}
            />
          </View>
        }
      />
    </Animated.View>
  );
};
export default TrySomethingCarousel;
