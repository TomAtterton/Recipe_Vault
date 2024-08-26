import { FlashList } from '@shopify/flash-list';
import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RecipeDetailType } from '@/types';
import { Routes } from '@/navigation/Routes';
import Animated from 'react-native-reanimated';

import HomeAnimation from '@/screens/Home/homeAnimation';
import HorizontalCard from '@/components/cards/HorizontalCard';
import { CONTAINER_WIDTH } from '@/components/cards/HorizontalCard/horizontalCard.style';
import EmptyList from '@/components/EmptyList';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './searchList.style';

const keyExtractor = (_: RecipeDetailType, index: number) => `item-${(_?.id || '') + index}`;

const SearchList = ({ data }: { data?: RecipeDetailType[] }) => {
  const { navigate } = useNavigation();
  const { styles, breakpoint } = useStyles(stylesheet);

  const renderItem = ({ item }: { item: RecipeDetailType }) => (
    <HorizontalCard
      {...item}
      onPress={() =>
        item.id &&
        navigate(Routes.RecipeDetailStack, {
          screen: Routes.RecipeDetails,
          params: {
            id: item.id,
            image: item?.image || null,
            servings: item?.servings || 1,
          },
        })
      }
    />
  );

  const numColumns = useMemo(() => {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
        return 2;
      case 'md':
        return 3;
      case 'lg':
      case 'xl':
        return 4;
      default:
        return 2;
    }
  }, [breakpoint]);

  return (
    <Animated.View style={styles.container} {...HomeAnimation.searchListAnimation}>
      <FlashList
        keyExtractor={keyExtractor}
        data={data}
        numColumns={numColumns}
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
