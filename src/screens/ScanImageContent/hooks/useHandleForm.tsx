import { useCallback } from 'react';
import { parseTextToData } from '@/screens/ScanImageContent/scanImageUtil';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { RecipeFormType } from '@/utils/recipeFormUtil';
import { useBoundStore } from '@/store';
import { navigateToAddRecipe } from '@/navigation/helper';

interface Props {
  id?: string | null;
  formId: keyof RecipeFormType;
  isEditing?: boolean;
  value: string;
}

const useHandleForm = ({ id, formId, isEditing, value }: Props) => {
  const navigation = useNavigation();
  const setScannedRecipe = useBoundStore((state) => state.setScannedRecipe);

  const handleSave = useCallback(async () => {
    setScannedRecipe({
      [formId]: parseTextToData(formId, value),
    });

    if (isEditing) {
      return navigation.navigate(Routes.RecipeDetailStack, {
        screen: Routes.EditRecipe,
        params: { id },
      });
    }
    return navigateToAddRecipe({ navigation, params: { id } });
  }, [formId, id, isEditing, navigation, setScannedRecipe, value]);

  return {
    handleSave,
  };
};

export default useHandleForm;
