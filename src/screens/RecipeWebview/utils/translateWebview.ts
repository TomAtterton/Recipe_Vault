import { Ingredient, RecipeDetailType } from '@/types';
import { randomUUID } from 'expo-crypto';
import { useBoundStore } from '@/store';

export const translateWebview = (text: string, url: string): Partial<RecipeDetailType> => {
  const recipe = JSON.parse(text);
  const cookTime = convertTimeToString(recipe?.cookTime);
  const prepTime = convertTimeToString(recipe?.prepTime);
  const userId = useBoundStore.getState().profile.id;
  const recipeDetail: Partial<RecipeDetailType> = {
    id: randomUUID(),
    userId, // TODO does this matter anymore
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

function decodeHtmlEntity(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
}

const convertRecipeIngredientInstructions = (
  recipeIngredientInstructions:
    | string[]
    | { text: string }[]
    | { itemListElement: { text: string }[] }[]
): Ingredient[] => {
  return recipeIngredientInstructions.flatMap(
    (
      ingredientInstruction:
        | string
        | { text: string }
        | {
            itemListElement: { text: string }[];
          }
    ) => {
      if (typeof ingredientInstruction === 'string') {
        return [
          {
            title: '',
            id: randomUUID(),
            text: decodeHtmlEntity(ingredientInstruction),
            type: 'ingredient',
          },
        ];
      } else if ('text' in ingredientInstruction) {
        return [
          {
            title: '',
            id: randomUUID(),
            text: decodeHtmlEntity(ingredientInstruction.text),
            type: 'ingredient',
          },
        ];
      } else if ('itemListElement' in ingredientInstruction) {
        return ingredientInstruction.itemListElement.map((item: { text: string }) => {
          return {
            title: '',
            id: randomUUID(),
            text: decodeHtmlEntity(item.text),
            type: 'ingredient',
          };
        });
      } else {
        return [];
      }
    }
  );
};
const convertImage = (
  image?: string | ({ url: string } | string)[] | { url: string }
): string | undefined => {
  if (typeof image === 'string') {
    return image;
  } else if (Array.isArray(image)) {
    if (typeof image[0] === 'string') {
      return image[0];
    } else if (image[0].url) {
      return image[0].url;
    } else {
      return undefined;
    }
  } else if (image && image.url) {
    return image.url;
  } else {
    return undefined;
  }
};

const convertRecipeYield = (recipeYield?: string | number | string[]): number => {
  if (typeof recipeYield === 'string') {
    const firstNumber = recipeYield.match(/\d+/);
    return firstNumber ? parseInt(firstNumber[0]) : 0;
  } else if (typeof recipeYield === 'number') {
    return recipeYield;
  } else if (Array.isArray(recipeYield)) {
    return parseInt(recipeYield[0].replace(/\D/g, ''));
  } else {
    return 0;
  }
};

const convertTimeToString = (time?: string): string => {
  try {
    if (!time) {
      console.log('no time');
      return '0 minutes';
    }
    // if time is in ISO 8601 format

    if (time.includes('PT')) {
      const timeArray = time.split('T');

      if (timeArray.length !== 2) {
        throw new Error('Invalid time format');
      }

      const hoursPart = timeArray[1].split('H');

      if (hoursPart.length === 1) {
        const minutes = hoursPart[0].split('M')[0];
        return formatTime(0, parseInt(minutes));
      } else if (hoursPart.length === 2) {
        const hours = parseInt(hoursPart[0]);
        const minutesPart = hoursPart[1].split('M');

        if (minutesPart.length === 1) {
          const minutes = parseInt(minutesPart[0]);
          return formatTime(hours, minutes);
        } else {
          throw new Error('Invalid time format');
        }
      } else {
        throw new Error('Invalid time format');
      }
    } else {
      const dateToConvert = new Date(time);
      const hours = dateToConvert.getUTCHours();
      const minutes = dateToConvert.getUTCMinutes();
      return formatTime(hours, minutes);
    }
  } catch (error) {
    return '0 minutes';
  }
};

const formatTime = (hours: number, minutes: number): string => {
  const hoursString = hours !== 1 ? `${hours} hours` : `${hours} hour`;
  const minutesString = minutes !== 1 ? `${minutes} minutes` : `${minutes} minute`;

  if (hours > 0 && minutes > 0) {
    return `${hoursString} ${minutesString}`;
  } else if (hours > 0) {
    return hoursString;
  } else if (minutes > 0) {
    return minutesString;
  } else {
    return '0 minutes';
  }
};
