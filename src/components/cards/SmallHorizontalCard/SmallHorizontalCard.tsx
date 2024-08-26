import { TouchableOpacity, View } from 'react-native';
import { Routes } from '@/navigation/Routes';
import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import useDeleteMealPlan from '@/database/api/mealplan/useDeleteMealPlan';
import { MenuView } from '@react-native-menu/menu';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './smallHorizontalCard.style';
import { MealPlanType } from '@/screens/MealPlan/MealPlan';
import Icon from '@/components/Icon';
import { IconName } from '@/components/Icon/types';
import Image from '@/components/Image';
import { showErrorMessage } from '@/utils/promptUtils';

interface Props {
  item: MealPlanType;
}

const SmallHorizontalCard = ({ item }: Props) => {
  const { onDeleteMealPlan } = useDeleteMealPlan();
  const navigation = useNavigation();

  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const handleDeleteMealPlan = useCallback(
    async (id: string) => {
      try {
        await onDeleteMealPlan({ id });
      } catch (e) {
        showErrorMessage('Something went wrong');
      }
    },
    [onDeleteMealPlan]
  );

  const icon: Partial<IconName> = useMemo(() => {
    switch (item.entryType) {
      case 'breakfast':
        return 'sunrise';
      case 'lunch':
        return 'midday';
      case 'dinner':
        return 'sunset';
      default:
        return 'midday';
    }
  }, [item.entryType]);

  return (
    <MenuView
      style={styles.item}
      shouldOpenOnLongPress={true}
      isAnchoredToRight={true}
      actions={[
        {
          id: 'delete',
          title: 'Delete',
          attributes: {
            destructive: true,
          },
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        const event = nativeEvent?.event;
        if (!event) return;
        handleDeleteMealPlan(item.id);
      }}
    >
      <TouchableOpacity
        onPress={() =>
          item.recipeId &&
          navigation.navigate(Routes.RecipeDetailStack, {
            screen: Routes.RecipeDetails,
            params: {
              id: item.recipeId,
              image: item?.image || null,
              servings: item?.servings || 1,
            },
          })
        }
        style={styles.itemContent}
      >
        <Image style={styles.image} source={{ uri: item?.image }} />
        <Typography numberOfLines={2} variant={'bodyMedium'}>{`${item.title} for `}</Typography>
        <View style={styles.metaContainer}>
          <Icon name={icon} size={18} color={colors.primary} />
          <Typography style={styles.metaTitle}>{item.entryType}</Typography>
        </View>
      </TouchableOpacity>
    </MenuView>
  );
};

export default SmallHorizontalCard;
