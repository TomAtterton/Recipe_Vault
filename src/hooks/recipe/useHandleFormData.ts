import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { defaultValues, RecipeFormType, transformDefaultValues } from '@/utils/recipeFormUtil';
import { useBoundStore } from '@/store';
import { UseFormReset, UseFormSetValue } from 'react-hook-form/dist/types/form';
import { RecipeDetailType } from '@/types';

const useHandleFormData = ({
  setValue,
  reset,
  clearErrors,
}: {
  setValue: UseFormSetValue<RecipeFormType>;
  reset: UseFormReset<RecipeFormType>;
  clearErrors: () => void;
}) => {
  const setScannedRecipe = useBoundStore((state) => state.setScannedRecipe);
  const scannedData = useBoundStore((state) => state.scannedRecipe);

  const handleResetForm = (sourceData: RecipeDetailType | null | undefined) => {
    if (sourceData) {
      reset(transformDefaultValues(sourceData));
    } else {
      reset(defaultValues);
    }
    clearErrors();
  };

  useFocusEffect(
    useCallback(() => {
      if (scannedData) {
        Object.entries(scannedData).forEach(([key, value]) => {
          setValue(key as keyof RecipeFormType, value);
        });
        setScannedRecipe(undefined);
      }
    }, [scannedData, setScannedRecipe, setValue]),
  );

  const onClearForm = () => {
    setScannedRecipe(undefined);
    handleResetForm(null);
  };

  return { onClearForm };
};

export default useHandleFormData;
