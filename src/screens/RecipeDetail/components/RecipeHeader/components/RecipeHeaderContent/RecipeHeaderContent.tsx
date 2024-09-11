import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './recipeHeaderContent.style';
import Icon from '@/components/Icon';
import IconButton from '@/components/buttons/IconButton';
import CalendarPicker from '@/components/CalendarPicker';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import StarRating from '@/components/StarRating';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RecipeDetailType } from '@/types';
import { openURL } from 'expo-linking';
import useRecipeDetail from '@/hooks/recipe/useRecipeDetail';
import debounce from 'lodash.debounce';
import { translate } from '@/core';

interface Props {
  id: string;
}

const hasZeroOnly = (timeString: string) => {
  const zeroOnlyRegex = /\b0\b/;
  return zeroOnlyRegex.test(timeString);
};

const RecipeHeaderContent = ({ id }: Props) => {
  const { data, onUpdateRecipe } = useRecipeDetail({
    id,
  });

  const handleUpdateRecipe = useCallback(
    (updateValues?: Partial<RecipeDetailType>) => {
      return updateValues && onUpdateRecipe({ updateValues, shouldNavigate: false });
    },
    [onUpdateRecipe],
  );
  const { name, prepTime, performTime: cookTime, rating: currentRating, source, note } = data || {};

  const debouncedUpdateRecipe = useMemo(() => {
    return handleUpdateRecipe && debounce(handleUpdateRecipe, 500);
  }, [handleUpdateRecipe]);

  const onRatingChange = useCallback(
    (value: number) => {
      debouncedUpdateRecipe?.({ rating: value });
    },
    [debouncedUpdateRecipe],
  );

  const { styles } = useStyles(stylesheet);
  const bottomSheetRef = React.useRef<BottomSheetRef>(null);
  const hasInfo = !!source || !!note;
  const { navigate } = useNavigation();

  const handleAddGroceries = () => {
    navigate(Routes.AddGroceries, {
      id,
    });
  };

  const hasPrepTime = useMemo(() => !!prepTime && !hasZeroOnly(prepTime), [prepTime]);
  const hasCookTime = useMemo(() => !!cookTime && !hasZeroOnly(cookTime), [cookTime]);

  return (
    <View style={styles.container} pointerEvents={'box-none'}>
      <View style={styles.contentContainer} pointerEvents={'box-none'}>
        {hasPrepTime && (
          /*// @ts-ignore*/
          <TimeContainer time={prepTime} title={translate('recipe_header_content.prep_time')} />
        )}
        {hasCookTime && (
          /*// @ts-ignore*/
          <TimeContainer time={cookTime} title={translate('recipe_header_content.cook_time')} />
        )}
        <View style={styles.buttonContainer} pointerEvents={'box-none'}>
          <IconButton
            iconSource={'shopping-cart-add'}
            buttonSize={'medium'}
            onPress={handleAddGroceries}
          />
          <CalendarPicker title={name} id={id} />
        </View>
      </View>

      <View style={styles.titleContainer} pointerEvents={'box-none'}>
        <Typography style={styles.title} variant={'titleLarge'}>
          {name}
        </Typography>
        {hasInfo && (
          <IconButton
            style={styles.infoButton}
            iconSource={'info-border'}
            buttonSize={'small'}
            onPress={() => {
              bottomSheetRef.current?.present();
            }}
          />
        )}
      </View>
      <StarRating padding={40} onChange={onRatingChange} initialValue={currentRating || 0} />
      {hasInfo && (
        <BottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['40%']}>
          <View style={styles.infoContainer}>
            {!!source && (
              <InfoLabelButton
                title={translate('recipe_header_content.source')}
                buttonTitle={source}
                onPress={() => {
                  openURL(source);
                }}
              />
            )}
            {!!note && (
              <>
                <Typography variant={'titleSmall'}>
                  {translate('recipe_header_content.notes')}
                </Typography>
                <Typography style={styles.notes} variant={'titleSmall'}>
                  {note}
                </Typography>
              </>
            )}
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

const TimeContainer = ({ time, title }: { time: string; title: string }) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View pointerEvents={'none'} style={styles.timeContainer}>
      <Icon name={'clock'} size={16} color={theme.colors.primary} />
      <View style={styles.timeContent}>
        <Typography variant={'labelMedium'}>{time}</Typography>
        <Typography style={styles.timeTitle} variant={'labelMedium'}>
          {title}
        </Typography>
      </View>
    </View>
  );
};

export default RecipeHeaderContent;
