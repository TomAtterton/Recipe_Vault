import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RecipeFormType } from '@/utils/recipeFormUtil';
import { useCallback, useEffect } from 'react';
import { setScannedImage } from '@/store';

const useScanImageParser = ({
  isEditing,
  id,
  isNested,
}: {
  id?: string | null;
  isEditing?: boolean;
  isNested?: boolean;
}) => {
  const navigation = useNavigation();

  // Clear scanned image on mount
  useEffect(() => {
    setScannedImage('');
  }, []);

  const handleScanLiveText = useCallback(
    (formId: keyof RecipeFormType, value: string) => {
      navigation.navigate(Routes.ScanImageContent, {
        id,
        value,
        isEditing,
        isNested,
        formId,
      });
    },
    [id, isEditing, isNested, navigation],
  );

  return {
    handleScanLiveText,
  };
};

export default useScanImageParser;
