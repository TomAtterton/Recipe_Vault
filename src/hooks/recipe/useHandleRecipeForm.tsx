import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';

import {
  transformDefaultValues,
  recipeFormSchema,
  parseSectionData,
  RecipeFormType,
} from '@/utils/recipeFormUtil';

import { RecipeDetailType } from '@/types';
import { onUpdateRecipeProps } from '@/components/RecipeForm/RecipeForm';
import { showErrorMessage } from '@/utils/promptUtils';
import { setScannedImage } from '@/store';
import { translate } from '@/core';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { SubmitErrorHandler } from 'react-hook-form/dist/types/form';
import useHandleFormData from '@/hooks/recipe/useHandleFormData';

const useHandleRecipeForm = ({
  data,
  onSubmitForm,
}: {
  scannedData?: Partial<RecipeFormType>;
  data?: RecipeDetailType;
  onSubmitForm: onUpdateRecipeProps;
}) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { isSubmitting, dirtyFields },
  } = useForm<RecipeFormType>({
    resolver: zodResolver(recipeFormSchema),
    mode: 'onSubmit',
    defaultValues: transformDefaultValues(data),
    shouldFocusError: true,
  });

  const { onClearForm } = useHandleFormData({
    setValue,
    reset,
    formDefaultValues: control._defaultValues,
    data,
    clearErrors,
  });

  const onSubmit: SubmitHandler<RecipeFormType> = async (formData: RecipeFormType) => {
    try {
      const recipeIngredient = parseSectionData(formData.recipeIngredient);
      const recipeInstructions = parseSectionData(formData.recipeInstructions);
      const rating = Math.max(Number(formData.rating || 0), 0);

      const formattedObject = {
        ...formData,
        performTime: formData.cookTime,
        name: formData.title,
        recipeIngredient,
        recipeInstructions,
        rating,
        image: formData.imageUrl,
      } as any;

      await onSubmitForm({
        updateValues: formattedObject,
      });
      setScannedImage('');
      onClearForm();
    } catch (e) {
      // @ts-ignore
      showErrorMessage(e?.message || translate('default.error_message'), 3000);
    } finally {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const onError: SubmitErrorHandler<RecipeFormType> = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [scrollViewRef]);

  const { goBack } = useNavigation();

  const handleGoBack = () => {
    if (Object.keys(dirtyFields).length === 0) {
      goBack();
    } else {
      Alert.alert(
        translate('prompt.discard_changes.title'),
        translate('prompt.discard_changes.message'),
        [
          {
            text: translate('prompt.discard_changes.cancel'),
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: translate('prompt.discard_changes.discard'),
            style: 'destructive',
            onPress: () => {
              goBack();
            },
          },
        ],
      );
    }
  };

  return {
    handleGoBack,
    control,
    onSubmit: handleSubmit(onSubmit, onError),
    isSubmitting,
    scrollViewRef,
    onClearForm,
  };
};

export default useHandleRecipeForm;
