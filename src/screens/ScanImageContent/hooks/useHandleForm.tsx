import { useCallback } from 'react';
import { parseTextToData } from '@/screens/ScanImageContent/scanImageUtil';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { RecipeFormType } from '@/utils/recipeFormUtil';

interface Props {
  id?: string | null;
  formId: keyof RecipeFormType;
  isEditing?: boolean;
  value: string;
}

const useHandleForm = ({ id, formId, isEditing, value }: Props) => {
  const navigation = useNavigation();

  const handleSave = useCallback(async () => {
    // Pass and merge params back to home screen
    const params = {
      id,
      scanContent: {
        data: {
          [formId]: parseTextToData(formId, value),
        },
      },
    };

    if (isEditing) {
      return navigation.navigate(Routes.RecipeDetailStack, {
        screen: Routes.EditRecipe,
        params,
      });
    }
    return navigation.navigate(Routes.AddRecipe, params);
  }, [formId, id, isEditing, navigation, value]);

  return {
    handleSave,
  };
};

export default useHandleForm;
