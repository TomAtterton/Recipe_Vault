import { useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';

import {
  transformDefaultValues,
  recipeFormSchema,
  defaultValues,
  parseSectionData,
  RecipeFormType,
} from '@/utils/recipeFormUtil';
import { RecipeDetailType } from '@/types';
import { onUpdateRecipeProps } from '@/components/RecipeForm/RecipeForm';
import { showErrorMessage } from '@/utils/promptUtils';
import { setScannedImage } from '@/store';
import { translate } from '@/core';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

const useHandleRecipeForm = ({
  scannedData,
  data,
  onSubmitForm,
}: {
  scannedData?: Partial<RecipeFormType>;
  data?: Partial<RecipeDetailType>;
  onSubmitForm: onUpdateRecipeProps;
}) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const transformedValues = useMemo(() => transformDefaultValues(data), [data]);
  const [isDirty, setIsDirty] = useState(false);

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
    defaultValues,
    shouldFocusError: true,
  });

  useFocusEffect(
    useCallback(() => {
      clearErrors();
    }, [clearErrors])
  );

  useEffect(() => {
    if (transformedValues) {
      Object.entries(transformedValues).forEach(([key, value]) => {
        setValue(key as keyof RecipeFormType, value);
      });
    }
  }, [setValue, transformedValues]);

  useEffect(() => {
    if (scannedData) {
      Object.entries(scannedData).forEach(([key, value]) => {
        setValue(key as keyof RecipeFormType, value);
      });
    }
  }, [scannedData, setValue]);

  useEffect(() => {
    if (Object.keys(dirtyFields).length > 0) {
      setIsDirty(true);
    }
  }, [dirtyFields]);

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
      reset();
      setIsDirty(false);
    } catch (e) {
      // @ts-ignore
      showErrorMessage(e?.message || 'Something went wrong', 3000);
    } finally {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const onClearForm = () => {
    reset();
    clearErrors();
    setIsDirty(false);
  };

  const { goBack } = useNavigation();

  const handleGoBack = () => {
    if (!isDirty) {
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
              setIsDirty(false);
              goBack();
            },
          },
        ]
      );
    }
  };

  return {
    handleGoBack,
    control,
    onSubmit: handleSubmit(onSubmit),
    isSubmitting,
    scrollViewRef,
    onClearForm,
  };
};

export default useHandleRecipeForm;
