export const parseRecipeTextToMarkdown = (text: string, ingredients: string[]) => {
  // Regular expressions to find time-related words and abbreviations
  const timeRegex =
    /\b(\d+(?:\s*-\s*|\s*to\s*)\d+|\d+)\s*(hrs?|hours?|mins?|minutes?|secs?|seconds?)\b/gi;
  // Regular expressions to find temperature-related values
  const temperatureRegex = /\b(\d+)\s*([°\u00B0]?[cC]|[fF][a-z]{1,2})\b/g;

  // Regular expressions to find measurements like ml, l, grams, g, etc.
  const measurementRegex = /\b(\d+)\s*(ml|l|grams|g|cm|kg|tsp|tbsp|cup)s?\b/gi;

  // Construct a regular expression to match all ingredients
  const ingredientsRegex = new RegExp('\\b(' + ingredients.join('|') + ')\\b', 'gi');

  // Replace time-related words and abbreviations with Markdown formatting
  let markdownText = text.replace(timeRegex, '**$1 $2**');
  // Replace temperature-related values with Markdown formatting
  markdownText = markdownText.replace(temperatureRegex, '**$1$2**');
  // Replace measurements with Markdown formatting
  markdownText = markdownText.replace(measurementRegex, '**$1$2**');
  // Replace ingredient names with Markdown formatting
  markdownText = markdownText.replace(ingredientsRegex, '**$1**');

  return markdownText;
};
