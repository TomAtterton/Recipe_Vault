import { useCallback } from 'react';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { RecipeFormType } from '@/utils/recipeFormUtil';
import { useBoundStore } from '@/store';
import { navigateToAddRecipe } from '@/navigation/helper';
import { parseTextToData } from '@/screens/RecipeTextInputContainer/recipeFormUtil';

interface Props {
  id?: string | null;
  formId: keyof RecipeFormType;
  isEditing?: boolean;
  isNested?: boolean;
  value: string;
}

const useHandleForm = ({ id, formId, isEditing, isNested, value }: Props) => {
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
    return navigateToAddRecipe({ navigation, params: { id, isNested } });
  }, [formId, id, isEditing, isNested, navigation, setScannedRecipe, value]);

  return {
    handleSave,
  };
};

export default useHandleForm;
