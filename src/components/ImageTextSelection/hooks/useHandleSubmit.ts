import { Ingredient, Instruction } from '@/types';
import {
  convertRecipeYield,
  convertTimeToString,
} from '@/screens/RecipeWebview/utils/translateWebview';
import { randomUUID } from 'expo-crypto';
import { getUserId } from '@/hooks/common/useUserId';
import { navigateToAddRecipe } from '@/navigation/helper';
import { useNavigation } from '@react-navigation/native';
import { BoundingBox, SelectedBox } from '@/components/ImageTextSelection/types';

const useHandleSubmit = (selectedBlocks: SelectedBox[]) => {
  const navigation = useNavigation();

  const handleSubmit = () => {
    let title = '';
    let prepTime = '';
    let cookTime = '';
    let servings = 0;
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
        case 'servings':
          const servingsText = block.boundingBoxes.map((box) => box.text).join(' ');
          servings = convertRecipeYield(servingsText);
          break;
        case 'cooktime':
          const cookTimeText = block.boundingBoxes.map((box) => box.text).join(' ');
          cookTime = convertTimeToString(cookTimeText);
          break;
        case 'ingredients':
          ingredients = block.boundingBoxes.map((box) => ({
            id: randomUUID(),
            text: box?.text?.trim() || '',
            title: '',
            type: 'ingredient',
          }));
          break;
        case 'instructions':
          instructions = orderAndGroupInstructions(block.boundingBoxes);
          break;
        default:
          break;
      }
    });

    const recipeObject = {
      id: randomUUID(),
      userId: getUserId(),
      name: title,
      prepTime: prepTime,
      performTime: cookTime,
      description: '',
      rating: 0,
      dateAdded: '',
      dateUpdated: '',
      lastMade: '',
      servings: servings,
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

const orderAndGroupInstructions = (boundingBoxes: BoundingBox[]): Instruction[] => {
  let currentText = '';
  let currentNumber = null;
  let instructions: Instruction[] = [];

  const punctuationRegex = /[.!?]$/; // Regex to detect the end of a sentence
  const numberRegex = /^\d+\s/; // Regex to detect leading numbers (e.g., 1, 2, 3)

  boundingBoxes.forEach((box) => {
    const text = box.text?.trim();
    if (!text) return;

    // Check for a leading number
    const match = text.match(numberRegex);
    if (match) {
      if (currentText) {
        // Push the current instruction before starting a new one
        instructions.push({
          id: randomUUID(),
          text: currentText.trim(),
          title: '',
          type: 'ingredient',
        });
        currentText = ''; // Reset current text
      }
      currentNumber = match[0]; // Store the number for potential ordering later
      currentText += text; // Start the new instruction with the number
    } else {
      currentText += ` ${text}`; // Continue appending to current instruction
    }

    // If the text ends with punctuation, push the current instruction
    if (punctuationRegex.test(text)) {
      instructions.push({
        id: randomUUID(),
        text: currentText.trim(),
        title: '',
        type: 'ingredient',
      });
      currentText = ''; // Reset after pushing
    }
  });

  // Push any remaining text as the final instruction
  if (currentText) {
    instructions.push({
      id: randomUUID(),
      text: currentText.trim(),
      title: '',
      type: 'ingredient',
    });
  }

  // If numbers were found, sort the instructions based on them
  if (currentNumber) {
    instructions.sort((a, b) => {
      const numA = parseInt(a.text.match(numberRegex)?.[0] || '0', 10);
      const numB = parseInt(b.text.match(numberRegex)?.[0] || '0', 10);
      return numA - numB;
    });
  }

  return instructions;
};
