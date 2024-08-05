import useHandleRecipeForm from '@/hooks/recipe/useHandleRecipeForm';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';
import * as React from 'react';
import NumberPicker from 'src/components/NumberPicker';
import HourMinutePicker from 'src/components/HourMinutePicker';
import { stylesheet } from './recipeForm.styles';
import { RecipeDetailType } from '@/types';
import { Alert, View } from 'react-native';
import { ScanImageDataType } from '@/screens/ScanImageContent/scanImageUtil';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useStyles } from 'react-native-unistyles';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import ControlledInput from '@/components/inputs/ControlledInput';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import RatingContainer from '@/components/RecipeForm/components/RatingContainer';
import EditableSectionList from '@/components/RecipeForm/components/EditableSectionList';
import CategoryContainer from '@/components/RecipeForm/components/CategoryContainer';
import TagContainer from '@/components/RecipeForm/components/TagContainer';
import useScanImageParser from '@/components/RecipeForm/hooks/useScanImageParser';
import ControlledImagePicker from '@/components/RecipeForm/components/ImagePicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import useEditFloatingInput from '@/components/RecipeForm/hooks/useEditFloatingInput';
import { useMemo } from 'react';
import EditButton from '@/components/RecipeForm/components/EditButton';

export type onUpdateRecipeProps = ({
  updateValues,
}: {
  updateValues: Partial<RecipeDetailType>;
}) => Promise<void>;

interface Props {
  id?: string | null;
  scanContent?: {
    data: {
      [key: string]: ScanImageDataType;
    };
  };
  data?: Partial<RecipeDetailType>;
  onSubmitForm: onUpdateRecipeProps;
  buttonTitle: string;
  isEditing?: boolean;
  isNested?: boolean;
  onDeleteRecipe?: () => void;
}

const RecipeForm = ({
  id,
  scanContent,
  data,
  onSubmitForm,
  buttonTitle,
  isEditing,
  isNested,
  onDeleteRecipe,
}: Props) => {
  const { control, onSubmit, scrollViewRef, onClearForm, isSubmitting } = useHandleRecipeForm({
    scannedData: scanContent?.data,
    data,
    onSubmitForm,
  });

  const { handleScanLiveText } = useScanImageParser({
    id,
    isEditing,
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
  const { goBack } = useNavigation();
  const { top } = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

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
          onScanLiveText={handleScanLiveText}
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
        <CategoryContainer control={control} />
        <TagContainer control={control} />
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
            <NavBarButton iconSource={'arrow-left'} onPress={goBack} />
            {<NavBarButton iconSource={'bin'} onPress={handleDeleteRecipe} />}
          </>
        ) : (
          <EditButton onPress={onClearForm} />
        )}
      </View>
    </View>
  );
};

export default RecipeForm;
