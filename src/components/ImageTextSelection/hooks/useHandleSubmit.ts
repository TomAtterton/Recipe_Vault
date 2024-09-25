import { Ingredient, Instruction } from '@/types';
import { convertTimeToString } from '@/screens/RecipeWebview/utils/translateWebview';
import { randomUUID } from 'expo-crypto';
import { getUserId } from '@/hooks/common/useUserId';
import { Env } from '@/core/env';
import { navigateToAddRecipe } from '@/navigation/helper';
import { useNavigation } from '@react-navigation/native';
import { SelectedBox } from '@/components/ImageTextSelection/types';

const useHandleSubmit = (selectedBlocks: SelectedBox[]) => {
  const navigation = useNavigation();

  const handleSubmit = () => {
    let title = '';
    let prepTime = '';
    let cookTime = '';
    let ingredients: Ingredient[] = [];
    let instructions: Instruction[] = [];

    selectedBlocks.forEach((block) => {
      switch (block.title.toLowerCase()) {
        case 'title':
          title = block.boundingBoxes.map((box) => box.text).join(' ');
          break;
        case 'preptime':
          const prepTimeText = block.boundingBoxes.map((box) => box.text).join(' ');
          prepTime = convertTimeToString(prepTimeText);
          break;
        case 'cooktime':
          const cookTimeText = block.boundingBoxes.map((box) => box.text).join(' ');
          cookTime = convertTimeToString(cookTimeText);
          break;
        case 'ingredients':
          ingredients = block.boundingBoxes.map((box) => ({
            id: randomUUID(),
            text: box?.text?.trim() || '',
            title: '', // Always empty as you specified
            type: 'ingredient',
          }));
          break;
        case 'instructions':
          instructions = block.boundingBoxes.map((box) => ({
            id: randomUUID(),
            text: box?.text?.trim() || '',
            title: '', // Always empty as you specified
            type: 'ingredient',
          }));
          break;
        default:
          break;
      }
    });

    const recipeObject = {
      id: randomUUID(),
      userId: getUserId() || Env.TEST_USER_ID,
      name: title,
      prepTime: prepTime,
      performTime: cookTime,
      description: '',
      rating: 0,
      dateAdded: '',
      dateUpdated: '',
      lastMade: '',
      servings: 0,
      recipeTags: [],
      recipeCategory: [],
      recipeIngredient: ingredients,
      recipeInstructions: instructions,
    };

    navigateToAddRecipe({
      navigation,
      params: { data: recipeObject, isNested: true },
      shouldReplace: false,
    });

    console.log('recipeObject', recipeObject);
  };

  return { handleSubmit };
};

export default useHandleSubmit;
