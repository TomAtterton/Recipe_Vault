import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { defaultValues, RecipeFormType, transformDefaultValues } from '@/utils/recipeFormUtil';
import isEqual from 'lodash.isequal';
import { useBoundStore } from '@/store';
import { UseFormReset, UseFormSetValue } from 'react-hook-form/dist/types/form';
import { RecipeDetailType } from '@/types';

const useHandleFormData = ({
  setValue,
  reset,
  formDefaultValues,
  data,
  clearErrors,
}: {
  setValue: UseFormSetValue<RecipeFormType>;
  reset: UseFormReset<RecipeFormType>;
  formDefaultValues: any;
  data?: RecipeDetailType;
  clearErrors: () => void;
}) => {
  const webRecipe = useBoundStore((state) => state.webRecipe);
  const setWebRecipe = useBoundStore((state) => state.setWebRecipe);
  const setScannedRecipe = useBoundStore((state) => state.setScannedRecipe);
  const scannedData = useBoundStore((state) => state.scannedRecipe);

  const [isClearingForm, setIsClearingForm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (scannedData) {
        Object.entries(scannedData).forEach(([key, value]) => {
          setValue(key as keyof RecipeFormType, value);
        });
        setScannedRecipe(undefined);
      }
      if (isEqual(formDefaultValues, defaultValues) && !isClearingForm) {
        if (data) {
          reset(transformDefaultValues(data));
        } else {
          webRecipe && reset(transformDefaultValues(webRecipe));
        }
      } else {
        setIsClearingForm(false);
      }
      clearErrors();
    }, [
      scannedData,
      formDefaultValues,
      isClearingForm,
      clearErrors,
      setScannedRecipe,
      setValue,
      data,
      reset,
      webRecipe,
    ])
  );

  const onClearForm = () => {
    setScannedRecipe(undefined);
    setWebRecipe(undefined);
    setIsClearingForm(false);
    reset(defaultValues);
    clearErrors();
  };
  return { onClearForm };
};
export default useHandleFormData;
