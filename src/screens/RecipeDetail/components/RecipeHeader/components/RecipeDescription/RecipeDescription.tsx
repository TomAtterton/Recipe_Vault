import React, { useMemo } from 'react';
import { View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './recipeDescription.style';
import Icon from '@/components/Icon';
import IconButton from '@/components/buttons/IconButton';
import CalendarPicker from '@/components/CalendarPicker';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from '@/components/BottomSheet';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import StarRating from '@/components/StarRating';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { Ingredient } from '@/types';
import { openURL } from 'expo-linking';

interface Props {
  prepTime?: string | null;
  cookTime?: string | null;
  name?: string;
  id?: string;
  source?: string | null;
  note?: string | null;
  onRatingChange: (value: number) => void;
  currentRating?: number;
  ingredients?: Ingredient[];
}

const hasZeroOnly = (timeString: string) => {
  const zeroOnlyRegex = /\b0\b/;
  return zeroOnlyRegex.test(timeString);
};

const RecipeDescription = ({
  id,
  prepTime,
  cookTime,
  name,
  source,
  note,
  onRatingChange,
  currentRating,
  ingredients,
}: Props) => {
  const { styles } = useStyles(stylesheet);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const hasInfo = !!source || !!note;
  const { navigate } = useNavigation();

  const handleAddGroceries = () => {
    const ingredientsList = ingredients?.map((ingredient) => ingredient.text);
    navigate(Routes.AddGroceries, {
      ingredients: ingredientsList,
    });
  };

  const dynamicFontSize = name?.length && name.length > 30 ? 18 : 24;

  const hasPrepTime = useMemo(() => !!prepTime && !hasZeroOnly(prepTime), [prepTime]);
  const hasCookTime = useMemo(() => !!cookTime && !hasZeroOnly(cookTime), [cookTime]);

  return (
    <View style={styles.container} pointerEvents={'box-none'}>
      <View style={styles.contentContainer} pointerEvents={'box-none'}>
        {/*// @ts-ignore*/}
        {hasPrepTime && <TimeContainer time={prepTime} title={'Prep'} />}
        {/*// @ts-ignore*/}
        {hasCookTime && <TimeContainer time={cookTime} title={'Cook'} />}
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
        <Typography
          style={[
            styles.title,
            {
              fontSize: dynamicFontSize,
            },
          ]}
          // @ts-ignore
          pointerEvents={'none'}
          numberOfLines={2}
          variant={'titleLarge'}
        >
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
      {hasInfo && (
        <BottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['30%']}>
          <View style={styles.infoContainer}>
            {!!source && (
              <InfoLabelButton
                title={'Source.'}
                buttonTitle={source}
                onPress={() => {
                  openURL(source);
                }}
              />
            )}
            {!!note && (
              <>
                <Typography variant={'titleSmall'}>Notes.</Typography>
                <Typography style={styles.notes} variant={'titleSmall'}>
                  {note}
                </Typography>
              </>
            )}
          </View>
        </BottomSheet>
      )}
      <StarRating onChange={onRatingChange} initialValue={currentRating} />
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

export default RecipeDescription;
