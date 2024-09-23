import { instructionFilterWords } from '@/services/parser/ingredients/staticData';
import { Ingredient as ParseIngredient, parseIngredient } from 'parse-ingredient';
import { Ingredient } from '@/types';
import { createIngredientRegex } from '@/services/parser/ingredients/markdownParser';

const instructionFilterWordsRegex = new RegExp(
  '\\b(' + instructionFilterWords.join('|') + ')\\b',
  'gi',
);

/**
 *  Returns an array of strings that represent the ingredient names
 * @param ingredient
 */
const parseIngredientName = (ingredient: string): string[] => {
  const { description }: ParseIngredient = parseIngredient(ingredient)[0];
  const cleanedDescription = description
    .replace(instructionFilterWordsRegex, '')
    .replace(/,/g, '')
    .replace(/[^a-zA-Z\s'’\-éáíúóàèçñüöäåøßâêîôûäëïüöæœŒ]/g, '') // Allow alphabet characters, spaces, apostrophes, hyphens, and specific accented characters like 'é', 'á', etc., and 'saké'
    .trim();

  return cleanedDescription.split(' ').filter((word) => word.trim() !== ''); // Remove any empty strings
};

export const flattenSanitizeIngredients = (ingredients: Ingredient[] | string[]): string[] => {
  return ingredients.flatMap(
    (ingredient) =>
      parseIngredientName(typeof ingredient !== 'string' ? ingredient?.text : ingredient) || [],
  );
};

const normalizeText = (text: string): string => {
  return text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
};

export const filterIngredientsForCurrentStep = (
  currentInstruction: string,
  sanitizedIngredients: string[],
  scaledIngredients: string[],
): string[] => {
  // Normalize the instruction text
  const normalizedInstruction = normalizeText(currentInstruction);

  // Create a regex that matches any of the sanitized ingredients, handling plurals
  const ingredientRegex = createIngredientRegex(sanitizedIngredients);

  // Find all matches of ingredients in the instruction
  const matches = normalizedInstruction.match(ingredientRegex);

  if (!matches) {
    return [];
  }

  // Convert matches to a Set to avoid duplicates
  const matchedSanitizedIngredients = new Set(matches.map((match) => match.trim().toLowerCase()));

  // Return the scaled ingredients if any of their corresponding sanitized ingredients were matched
  return scaledIngredients.filter((scaledIngredient) => {
    return sanitizedIngredients.some((sanitizedIngredient) => {
      // Normalize the sanitized ingredient and check if it's in the matches
      return (
        matchedSanitizedIngredients.has(normalizeText(sanitizedIngredient)) &&
        scaledIngredient.toLowerCase().includes(sanitizedIngredient.toLowerCase())
      );
    });
  });
};
