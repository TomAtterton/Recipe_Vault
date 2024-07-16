import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

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
import { ScrollView } from 'react-native';
import { setScannedImage } from '@/store';
import { useFocusEffect } from '@react-navigation/native';

const useHandleRecipeForm = ({
  scannedData,
  data,
  onSubmitForm,
}: {
  scannedData?: Partial<RecipeFormType>;
  data?: Partial<RecipeDetailType>;
  onSubmitForm: onUpdateRecipeProps;
}) => {
  const scrollViewRef = useRef<ScrollView | undefined>(undefined);
  const transformedValues = useMemo(() => transformDefaultValues(data), [data]);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { isSubmitting },
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
  };

  return {
    control,
    onSubmit: handleSubmit(onSubmit),
    isSubmitting,
    scrollViewRef,
    onClearForm,
  };
};

export default useHandleRecipeForm;
