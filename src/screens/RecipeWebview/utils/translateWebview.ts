import { Ingredient, RecipeDetailType } from '@/types';
import { randomUUID } from 'expo-crypto';
import { getUserId } from '@/hooks/common/useUserId';
import { decode } from 'html-entities';

export const translateWebview = (text: string, url: string): RecipeDetailType => {
  const recipe = JSON.parse(text);
  const cookTime = convertTimeToString(recipe?.cookTime);
  const prepTime = convertTimeToString(recipe?.prepTime);

  const userId = getUserId();

  return {
    id: randomUUID(),
    userId: userId,
    description: recipe?.description || '',
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
};

export const convertRecipeIngredientInstructions = (
  recipeIngredientInstructions:
    | string
    | string[]
    | { text: string }[]
    | { itemListElement: { text: string }[] }[],
): Ingredient[] => {
  let sectionTitle = '';

  const mapInstruction = (text: string): Ingredient | null => {
    // Strip HTML tags
    const strippedText = text.replace(/<\/?[^>]+(>|$)/g, '').trim();

    // Decode HTML entities
    const decodedText = decodeHtmlEntity(strippedText);

    if (!decodedText) return null;

    const isSection = decodedText.endsWith(':');
    if (isSection) {
      sectionTitle = decodedText;
      return null;
    }

    return {
      title: sectionTitle,
      id: randomUUID(),
      text: decodedText,
      type: 'ingredient',
    };
  };

  // Handle input that is a raw HTML string
  if (typeof recipeIngredientInstructions === 'string') {
    const instructionsArray = recipeIngredientInstructions
      .split(/<\/?p[^>]*>/gi)
      .map((text) => decodeHtmlEntity(text))
      .filter((text) => text.length > 0);

    return instructionsArray.flatMap(mapInstruction).filter(Boolean) as Ingredient[];
  }

  // Handle structured input (arrays)
  return recipeIngredientInstructions.flatMap((instruction) => {
    if (typeof instruction === 'string') {
      return mapInstruction(instruction) ?? [];
    } else if ('text' in instruction) {
      return mapInstruction(instruction.text) ?? [];
    } else if ('itemListElement' in instruction) {
      return instruction.itemListElement.flatMap((item) => mapInstruction(item.text) ?? []);
    }
    return [];
  });
};

function decodeHtmlEntity(str: string): string {
  return decode(str);
}

const convertImage = (
  image?: string | ({ url: string } | string)[] | { url: string },
): string | undefined => {
  if (typeof image === 'string') {
    return image;
  } else if (Array.isArray(image)) {
    return typeof image[0] === 'string' ? image[0] : image[0]?.url;
  } else {
    return image?.url;
  }
};

export const convertRecipeYield = (recipeYield?: string | number | string[]): number => {
  if (typeof recipeYield === 'number') {
    return recipeYield;
  } else if (typeof recipeYield === 'string') {
    const firstNumber = recipeYield.match(/\d+/);
    return firstNumber ? parseInt(firstNumber[0], 10) : 0;
  } else if (Array.isArray(recipeYield)) {
    const firstNumber = recipeYield[0].match(/\d+/);
    return firstNumber ? parseInt(firstNumber[0], 10) : 0;
  } else {
    return 0;
  }
};

export const convertTimeToString = (time?: string | number): string => {
  if (!time) return '0 minutes';

  try {
    if (typeof time === 'string' && time.startsWith('PT')) {
      const timePattern = /PT(?:(\d+)H)?(?:(\d+)M)?/;
      const [, hours, minutes] = time.match(timePattern) ?? [];
      return formatTime(parseInt(hours || '0', 10), parseInt(minutes || '0', 10));
    } else if (typeof time === 'string') {
      const numberPattern = /(\d+)\s*(minutes?|hours?)/i;
      const match = time.match(numberPattern);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        return `${value} ${unit}`;
      }
      return '0 minutes';
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
