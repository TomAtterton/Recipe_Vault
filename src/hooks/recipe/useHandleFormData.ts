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
  const setScannedRecipe = useBoundStore((state) => state.setScannedRecipe);
  const scannedData = useBoundStore((state) => state.scannedRecipe);

  const [isClearingForm, setIsClearingForm] = useState(false);

  // Function to reset form with the appropriate values (data, webRecipe, etc.)
  const handleResetForm = (sourceData: RecipeDetailType | null | undefined) => {
    if (sourceData) {
      reset(transformDefaultValues(sourceData));
    } else {
      reset(defaultValues);
    }
    clearErrors();
  };

  // Populate form from scanned data
  const populateFromScannedData = () => {
    if (scannedData) {
      Object.entries(scannedData).forEach(([key, value]) => {
        setValue(key as keyof RecipeFormType, value);
      });
      setScannedRecipe(undefined);
    }
  };

  useFocusEffect(
    useCallback(
      () => {
        populateFromScannedData();

        if (isEqual(formDefaultValues, defaultValues) && !isClearingForm) {
          if (data) {
            handleResetForm(data);
          }
        } else {
          setIsClearingForm(false);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        scannedData,
        formDefaultValues,
        isClearingForm,
        clearErrors,
        setScannedRecipe,
        setValue,
        data,
        reset,
      ],
    ),
  );

  const onClearForm = () => {
    setScannedRecipe(undefined);
    setIsClearingForm(false);
    handleResetForm(null);
  };

  return { onClearForm };
};

export default useHandleFormData;
