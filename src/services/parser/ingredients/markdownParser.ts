const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper function to create plural-friendly version of the ingredient
const makePluralPattern = (ingredient: string): string => {
  return `(?:${escapeRegExp(ingredient)}(?:s|es|ies)?)`;
};

// Helper function to create a combined regex pattern for ingredients and measurements
export const createIngredientRegex = (ingredients: string[]): RegExp => {
  // Sort ingredients by length (longest first) to prioritize longer matches
  const sortedIngredients = ingredients.sort((a, b) => b.length - a.length);

  // Create a single regex pattern for all ingredients, handling plurals
  const ingredientPattern = sortedIngredients.map(makePluralPattern).join('|');

  // Measurement pattern to detect common measurements
  const measurementPattern =
    '(?:\\d+(?:\\.\\d+)?(?:\\s*(?:g|kg|ml|l|oz|lb|cup|tbsp|tsp|pint|quart|gallon)s?)?\\s+)?';

  // Combine measurement pattern with ingredient pattern
  const combinedPattern = `\\b(${measurementPattern}(?:${ingredientPattern}))\\b`;

  return new RegExp(combinedPattern, 'gi');
};

// Function to convert ingredient text to markdown
export const parseIngredientToMarkdown = (text: string, ingredients: string[]): string => {
  const ingredientRegex = createIngredientRegex(ingredients);

  // Regex patterns for time and temperature
  const timeRegex = /\b(\d+(?:\s*(?:-|to)\s*\d+)?)\s*((?:hr|hour|min|minute|sec|second)s?)\b/gi;
  const temperatureRegex =
    /\b(\d+(?:\.\d+)?)\s*(?:degrees?\s*)?([°\u00B0]?[CFcf](?:ahrenheit|elsius)?)\b/g;

  // Apply replacements
  const markdownText = text
    .replace(timeRegex, '~~$1 $2~~')
    .replace(temperatureRegex, '^^$1 $2^^')
    .replace(ingredientRegex, '**$1**');

  return markdownText;
};
