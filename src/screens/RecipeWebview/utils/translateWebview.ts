import { Ingredient, RecipeDetailType } from '@/types';
import { randomUUID } from 'expo-crypto';
import { useBoundStore } from '@/store';
import { string } from 'zod';

export const translateWebview = (text: string, url: string): Partial<RecipeDetailType> => {
  const recipe = JSON.parse(text);
  const cookTime = convertTimeToString(recipe?.cookTime);
  const prepTime = convertTimeToString(recipe?.prepTime);
  const userId = useBoundStore.getState().profile.id;

  const recipeDetail: Partial<RecipeDetailType> = {
    id: randomUUID(),
    userId,
    name: recipe?.name || '',
    rating: 0,
    dateAdded: '',
    dateUpdated: '',
    image: convertImage(recipe?.image),
    note: '',
    lastMade: '',
    source: url,
    performTime: cookTime,
    prepTime: prepTime,
    servings: convertRecipeYield(recipe?.recipeYield),
    recipeTags: [],
    recipeCategory: [],
    recipeIngredient: convertRecipeIngredientInstructions(recipe?.recipeIngredient),
    recipeInstructions: convertRecipeIngredientInstructions(recipe?.recipeInstructions),
  };
  return recipeDetail;
};

function decodeHtmlEntity(str: string): string {
  return str.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
}

export const convertRecipeIngredientInstructions = (
  recipeIngredientInstructions:
    | string[]
    | { text: string }[]
    | { itemListElement: { text: string }[] }[]
): Ingredient[] => {
  let sectionTitle = '';

  const mapInstruction = (text: string): Ingredient | [] => {
    const decodedText = decodeHtmlEntity(text);
    const type = decodedText.endsWith(':') ? 'section' : 'ingredient';
    sectionTitle = type === 'section' ? decodedText : sectionTitle;
    return decodedText && decodedText !== sectionTitle
      ? {
          title: sectionTitle,
          id: randomUUID(),
          text: decodedText,
          type,
        }
      : [];
  };

  return recipeIngredientInstructions.flatMap((ingredientInstruction) => {
    if (typeof ingredientInstruction === 'string') {
      return mapInstruction(ingredientInstruction);
    } else if ('text' in ingredientInstruction) {
      return mapInstruction(ingredientInstruction.text);
    } else if ('itemListElement' in ingredientInstruction) {
      return ingredientInstruction.itemListElement.flatMap((item) => mapInstruction(item.text));
    } else {
      return [];
    }
  });
};

const convertImage = (
  image?: string | ({ url: string } | string)[] | { url: string }
): string | undefined => {
  if (typeof image === 'string') {
    return image;
  } else if (Array.isArray(image)) {
    return typeof image[0] === 'string' ? image[0] : image[0]?.url;
  } else {
    return image?.url;
  }
};

const convertRecipeYield = (recipeYield?: string | number | string[]): number => {
  if (typeof recipeYield === 'number') {
    return recipeYield;
  } else if (typeof recipeYield === 'string') {
    const firstNumber = recipeYield.match(/\d+/);
    return firstNumber ? parseInt(firstNumber[0]) : 0;
  } else if (Array.isArray(recipeYield)) {
    const firstNumber = recipeYield[0].match(/\d+/);
    return firstNumber ? parseInt(firstNumber[0]) : 0;
  } else {
    return 0;
  }
};

export const convertTimeToString = (time?: string | number): string => {
  if (!time) return '0 minutes';

  try {
    if (time === typeof string && time?.startsWith('PT')) {
      const timePattern = /PT(?:(\d+)H)?(?:(\d+)M)?/;
      const [, hours, minutes] = time.match(timePattern) ?? [];
      return formatTime(parseInt(hours || '0', 10), parseInt(minutes || '0', 10));
    } else {
      const date = new Date(time);
      return formatTime(date.getUTCHours(), date.getUTCMinutes());
    }
  } catch {
    return '0 minutes';
  }
};

const formatTime = (hours: number, minutes: number): string => {
  const hoursString = hours === 1 ? '1 hour' : `${hours} hours`;
  const minutesString = minutes === 1 ? '1 minute' : `${minutes} minutes`;

  return hours > 0 && minutes > 0
    ? `${hoursString} ${minutesString}`
    : hours > 0
    ? hoursString
    : minutes > 0
    ? minutesString
    : '0 minutes';
};
