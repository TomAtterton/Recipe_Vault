import { useCallback, useRef, useState } from 'react';
import { WebViewMessageEvent } from 'react-native-webview/src/WebViewTypes';
import { translateWebview } from '@/screens/RecipeWebview/utils/translateWebview';
import { Routes } from '@/navigation/Routes';
import { showErrorMessage } from '@/utils/promptUtils';
import { useNavigation } from '@react-navigation/native';

const useHandleDetection = (uri: string) => {
  const navigation = useNavigation();

  const recipeParseRef = useRef<string | null>(null);
  const [recipeDetected, setRecipeDetected] = useState(false);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    const message = event.nativeEvent.data;
    const containsRecipe = message !== 'doesNotContainRecipe';
    if (containsRecipe) {
      recipeParseRef.current = message;
    }
    setRecipeDetected(containsRecipe);
  }, []);

  const handleAddRecipe = async () => {
    if (recipeParseRef?.current) {
      try {
        const data = translateWebview(recipeParseRef?.current, uri);

        return navigation.navigate(Routes.AddRecipe, {
          data,
        });
      } catch (error) {
        console.log('error', error);
        showErrorMessage('Error parsing recipe');
      }
    }
    showErrorMessage('No recipe detected');
  };

  return {
    recipeDetected,
    handleMessage,
    handleAddRecipe,
  };
};

export default useHandleDetection;
