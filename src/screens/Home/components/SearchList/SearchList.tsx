import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RecipeDetailType } from '@/types';
import { Routes } from '@/navigation/Routes';
import Animated from 'react-native-reanimated';

import styles from './searchList.style';
import HomeAnimation from '@/screens/Home/homeAnimation';
import HorizontalCard from '@/components/cards/HorizontalCard';
import { CONTAINER_WIDTH } from '@/components/cards/HorizontalCard/horizontalCard.style';
import EmptyList from '@/components/EmptyList';

const keyExtractor = (_: Partial<RecipeDetailType>, index: number) =>
  `item-${(_?.id || '') + index}`;

const SearchList = ({ data }: { data?: Partial<RecipeDetailType>[] }) => {
  const { navigate } = useNavigation();

  const renderItem = useCallback(
    ({ item }: { item: Partial<RecipeDetailType> }) => (
      <HorizontalCard
        {...item}
        onPress={() =>
          item.id &&
          navigate(Routes.RecipeDetailStack, {
            screen: Routes.RecipeDetails,
            params: {
              id: item.id,
            },
          })
        }
      />
    ),
    [navigate]
  );

  return (
    <Animated.View style={styles.container} {...HomeAnimation.searchListAnimation}>
      <FlashList
        keyExtractor={keyExtractor}
        data={data}
        numColumns={2}
        disableAutoLayout={true}
        keyboardDismissMode={'on-drag'}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList isLoading={false} />}
        estimatedItemSize={CONTAINER_WIDTH}
      />
    </Animated.View>
  );
};

export default SearchList;
