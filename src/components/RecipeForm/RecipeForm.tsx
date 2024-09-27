import useHandleRecipeForm from '@/hooks/recipe/useHandleRecipeForm';
import * as React from 'react';
import NumberPicker from 'src/components/NumberPicker';
import HourMinutePicker from 'src/components/HourMinutePicker';
import { stylesheet } from './recipeForm.styles';
import { RecipeDetailType } from '@/types';
import { Alert, View } from 'react-native';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useStyles } from 'react-native-unistyles';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import ControlledInput from '@/components/inputs/ControlledInput';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import RatingContainer from '@/components/RecipeForm/components/RatingContainer';
import useScanImageParser from '@/components/RecipeForm/hooks/useScanImageParser';
import ControlledImagePicker from '@/components/RecipeForm/components/ImagePicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import useEditFloatingInput from '@/components/RecipeForm/hooks/useEditFloatingInput';
import { useMemo } from 'react';
import EditableSectionList from './components/EditableSectionList';
import ControlledCategoryContainer from '@/components/RecipeForm/components/ControlledCategoryContainer';
import ControlledTagContainer from '@/components/RecipeForm/components/ControlledTagContainer';
import { NestableScrollContainer } from '@/components/DraggableFlatList';
import { Routes } from '@/navigation/Routes';
import EditButton from '@/components/RecipeForm/components/EditButton';

export type onUpdateRecipeProps = ({
  updateValues,
}: {
  updateValues: RecipeDetailType;
}) => Promise<void>;

interface Props {
  id?: string | null;
  data?: RecipeDetailType;
  onSubmitForm: onUpdateRecipeProps;
  buttonTitle: string;
  isEditing?: boolean;
  isNested?: boolean;
  onDeleteRecipe?: () => void;
}

const RecipeForm = ({
  id,
  data,
  onSubmitForm,
  buttonTitle,
  isEditing,
  isNested,
  onDeleteRecipe,
}: Props) => {
  const { control, onSubmit, scrollViewRef, onClearForm, isSubmitting, handleGoBack } =
    useHandleRecipeForm({ data, onSubmitForm });

  const { handleScanLiveText } = useScanImageParser({
    id,
    isEditing,
    isNested,
  });

  const handleDeleteRecipe = () => {
    Alert.alert('Delete Recipe', 'Are you sure you want to delete this recipe?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDeleteRecipe,
      },
    ]);
  };

  const { styles } = useStyles(stylesheet);
  const { top } = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const navigation = useNavigation();

  // @ts-ignore
  useScrollToTop(scrollViewRef);

  const { handleEdit } = useEditFloatingInput();

  const bottomPadding = useMemo(() => {
    return isNested ? 32 : tabBarHeight + 32;
  }, [isNested, tabBarHeight]);

  const topPadding = useMemo(() => {
    return top + 32;
  }, [top]);

  return (
    <View style={styles.container}>
      <NestableScrollContainer
        // @ts-ignore
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={[
          styles.scrollContainer,
          {
            marginBottom: bottomPadding,
          },
        ]}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: topPadding,
          },
        ]}
      >
        <ControlledInput
          style={styles.input}
          name="title"
          label="Title"
          multiline
          onEdit={handleEdit}
          control={control}
        />
        <RatingContainer name={'rating'} control={control} />
        <ControlledImagePicker control={control} name={'imageUrl'} />
        <HourMinutePicker
          control={control}
          name="prepTime"
          containerStyle={styles.picker}
          title={'Prep time.'}
          description={'How long does it take to prepare this recipe?'}
        />
        <HourMinutePicker
          control={control}
          name="cookTime"
          containerStyle={styles.picker}
          title={'Cook time.'}
          description={'How long does it take to cook this recipe?'}
        />
        <NumberPicker
          containerStyle={styles.picker}
          title={'Servings.'}
          valueSuffix={'servings'}
          description={'How many servings does this recipe make?'}
          control={control}
          name="servings"
        />
        <EditableSectionList
          control={control}
          name="recipeIngredient"
          title={'Ingredients'}
          onEdit={handleEdit}
          type={'ingredient'}
          onScanLiveText={handleScanLiveText}
        />
        <EditableSectionList
          control={control}
          onEdit={handleEdit}
          name="recipeInstructions"
          title={'Instructions'}
          type={'instruction'}
          onScanLiveText={handleScanLiveText}
        />

        <ControlledCategoryContainer control={control} />
        <ControlledTagContainer control={control} />
        <ControlledInput
          style={styles.input}
          name="source"
          label="Source"
          multiline
          onEdit={handleEdit}
          control={control}
        />
        <ControlledInput
          style={styles.input}
          name="note"
          label="Notes"
          onEdit={handleEdit}
          multiline
          control={control}
        />
        <PrimaryButton
          style={styles.button}
          onPress={onSubmit}
          title={buttonTitle}
          isLoading={isSubmitting}
        />
      </NestableScrollContainer>
      <View style={[styles.navigationHeader, { top }]}>
        {isNested ? (
          <>
            <NavBarButton iconSource={'arrow-left'} onPress={handleGoBack} />
            {isEditing && <NavBarButton iconSource={'bin'} onPress={handleDeleteRecipe} />}
          </>
        ) : (
          <View style={styles.headerNav}>
            <NavBarButton
              iconSource={'photo'}
              onPress={() => {
                navigation.navigate(Routes.RecipeDetectionStack, {
                  screen: Routes.ImageDetection,
                });
              }}
            />
            <EditButton onPress={onClearForm} />
          </View>
        )}
      </View>
    </View>
  );
};

export default RecipeForm;
