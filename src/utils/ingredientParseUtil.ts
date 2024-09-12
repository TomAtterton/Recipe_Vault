import { parseIngredient, Ingredient as ParseIngredient } from 'parse-ingredient';
import { Ingredient } from '@/types';
import { parseMetrics, RecipeUnit, scaleAmount } from '@/utils/ingredientsUtil';

const wordsToRemove: string[] = [
  'and',
  'or',
  'of',
  'the',
  'to',
  'for',
  'in',
  'if',
  'on',
  'from',
  'with',
  'about',
  'a',
  'an',
  'each',
  'cut',
  'about',
  'garnish',
  'sauce',
  'approximately',
  'serve',
  'into',
  'such as',
  'optional',
  'as needed',
  'to taste',
  'finely',
  'chopped',
  'diced',
  'minced',
  'sliced',
  'grated',
  'crushed',
  'peeled',
  'cored',
  'seeded',
  'trimmed',
  'halved',
  'quartered',
  'cubed',
  'pitted',
  'shredded',
  'fresh',
  'frozen',
];

const wordsToRemoveRegex = new RegExp('\\b(' + wordsToRemove.join('|') + ')\\b', 'gi');

export const parseIngredientName = (ingredient: string): string[] => {
  const { description }: ParseIngredient = parseIngredient(ingredient)[0];

  const cleanedDescription = description
    .replace(wordsToRemoveRegex, '')
    .replace(/,/g, '')
    .replace(/[^a-zA-Z\s'’\-éáíúóàèçñüöäåøßâêîôûäëïüöæœŒ]/g, '') // Allow alphabet characters, spaces, apostrophes, hyphens, and specific accented characters like 'é', 'á', etc., and 'saké'
    .trim();

  return cleanedDescription.split(' ').filter((word) => word.trim() !== ''); // Remove any empty strings
};

export const ingredientsParsed = (ingredients: Ingredient[]): string[] => {
  return ingredients.reduce<string[]>((acc, ingredient) => {
    const ingredientText = ingredient?.text;
    if (ingredientText) {
      acc.push(...parseIngredientName(ingredientText)); // Only one loop with reduce
    }
    return acc;
  }, []);
};

export const ingredientDescription = (
  ingredientKeyword: string,
  ingredients: Ingredient[],
  initialServings: number,
  servings: number,
  recipeUnit: RecipeUnit,
): string | undefined => {
  const lowerCaseKeyword = ingredientKeyword.toLowerCase();
  const ingredient = ingredients.find(({ text }) => text.toLowerCase().includes(lowerCaseKeyword));

  if (!ingredient || !ingredient.text) {
    return undefined;
  }

  const { description, quantity, unitOfMeasure } = parseMetrics({
    note: ingredient.text,
    recipeUnit,
  });

  const amount = scaleAmount(quantity || 1, servings, initialServings);

  return `${amount} ${unitOfMeasure ? `${unitOfMeasure} ` : ''}${description || ''}`;
};
