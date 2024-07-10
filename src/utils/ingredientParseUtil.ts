import { parseIngredient, Ingredient as ParseIngredient } from 'parse-ingredient';
import { Ingredient } from '@/types';

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
  // Add more preparation words here
];
const wordsToRemoveRegex = new RegExp('\\b(' + wordsToRemove.join('|') + ')\\b', 'gi');

export const parseIngredientName = (ingredient: string): string[] => {
  const { description }: ParseIngredient = parseIngredient(ingredient)[0];

  const cleanedDescription: string = description
    .replace(wordsToRemoveRegex, '')
    .replace(/,/g, '')
    .replace(/[^a-zA-Z\s'’\-éáíúóàèçñüöäåøßâêîôûäëïüöæœŒ]/g, '') // Allow alphabet characters, spaces, apostrophes, hyphens, and specific accented characters like 'é', 'á', etc., and 'saké'
    .trim();

  return cleanedDescription.split(' ').filter((word) => word.trim() !== ''); // Remove any empty strings
};

export const ingredientsParsed = (ingredients: Ingredient[]): string[] => {
  const parsedIngredients: string[] = [];
  ingredients.forEach((ingredient) => {
    const ingredientText = ingredient?.text;
    if (!ingredientText) return;
    parsedIngredients.push(...parseIngredientName(ingredient?.text));
  });

  return parsedIngredients;
};

export const ingredientDescription = (ingredientKeyword: string, ingredients: Ingredient[]) => {
  const ingredient = ingredients.find((_) => _.text.toLowerCase().includes(ingredientKeyword));
  return ingredient?.text;
};
