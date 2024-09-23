import convert from 'convert';
import { parseIngredient, UnitOfMeasure } from 'parse-ingredient';
import { useBoundStore } from '@/store';
import {
  conversionTableToGrams,
  imperialSet,
  metricSet,
  spoonSet,
} from '@/services/parser/ingredients/staticData';

export type RecipeUnit = 'metric' | 'imperial' | 'original';

export const parseIngredientMetrics = ({
  note,
  recipeUnit,
}: {
  note: string;
  recipeUnit: RecipeUnit;
}): any | {} => {
  const parsedIngredient = note ? parseIngredient(note)[0] : null;

  if (!parsedIngredient) return {};
  const { quantity, unitOfMeasure, description } = parsedIngredient;
  if (quantity && unitOfMeasure) {
    try {
      let value = {
        quantity,
        unit: unitOfMeasure,
      };

      if (recipeUnit === 'original') {
        return {
          ...parsedIngredient,
          description,
          quantity,
          unitOfMeasure,
        };
      }

      const isImperial = recipeUnit === 'imperial';

      const hasTablespoon = spoonSet.has(unitOfMeasure);
      const isImperialUnit = imperialSet.has(unitOfMeasure);
      const isMetricUnit = metricSet.has(unitOfMeasure);
      if (!hasTablespoon && (isImperial ? !isImperialUnit : !isMetricUnit)) {
        value = convert(quantity, unitOfMeasure as any).to('best', recipeUnit);
      }

      // Convert cup to grams over ml and l
      if (recipeUnit === 'metric' && unitOfMeasure === 'cup') {
        value = convertCupToGram(description, quantity) || value;
      }

      return {
        ...parsedIngredient,
        description,
        quantity: value?.quantity,
        unitOfMeasure: value?.unit,
      };
    } catch (error) {
      console.log('Error converting units', error);
      return parsedIngredient;
    }
  }

  return parsedIngredient;
};

export const scaleAmount = (amount: number, servings: number, initialServings: number): string => {
  if (amount === 0 || servings === 0 || initialServings === 0) {
    return '0';
  }

  const scaledAmount = amount * (servings / initialServings);
  const roundedAmount = Math.round(scaledAmount * 4) / 4; // Round to the nearest quarter

  if (roundedAmount === 0) {
    return '';
  }

  if (roundedAmount > 10) {
    return roundedAmount.toFixed(0);
  }

  const wholeNumber = Math.floor(roundedAmount);
  const fraction = roundedAmount - wholeNumber;

  if (fraction === 0) {
    return wholeNumber.toString();
  } else if (fraction === 0.25) {
    return wholeNumber ? `${wholeNumber} ¼` : '¼';
  } else if (fraction === 0.5) {
    return wholeNumber ? `${wholeNumber} ½` : '½';
  } else if (fraction === 0.75) {
    return wholeNumber ? `${wholeNumber} ¾` : '¾';
  } else {
    return roundedAmount.toFixed(2);
  }
};

interface ConvertedIngredient {
  quantity: number;
  unit: string;
}

const convertCupToGram = (ingredientName: string, quantity: number): ConvertedIngredient | null => {
  // Case-insensitive matching and singularization of the ingredient name
  const sanitizedIngredientName = ingredientName.trim().toLowerCase().replace(/s$/, '');
  // Iterate over the conversion table to find a match
  for (const key in conversionTableToGrams) {
    if (sanitizedIngredientName.includes(key)) {
      const ingredient = conversionTableToGrams[key];
      const convertedQuantity = quantity * ingredient.cup;
      return {
        quantity: convertedQuantity,
        unit: 'g',
      };
    }
  }

  // If no match is found, return null
  return null;
};

export const onFormatIngredientAmount = (amount: string, unitOfMeasure: UnitOfMeasure) => {
  if (!amount && !unitOfMeasure) return '';
  if (!amount) return unitOfMeasure;
  if (!unitOfMeasure) return amount;
  return `${amount} ${unitOfMeasure}`;
};

/**
 *  Formats an ingredient string based on the current servings and recipe unit
 */
export const formatIngredient = (
  ingredient: string,
  initialServings: number,
  servings?: number,
  recipeUnit?: RecipeUnit,
): string => {
  const currentServings = servings || useBoundStore.getState().currentServings;
  const currentRecipeUnit = recipeUnit || useBoundStore.getState().currentRecipeUnit;

  const { description, quantity, unitOfMeasure } = parseIngredientMetrics({
    note: ingredient,
    recipeUnit: currentRecipeUnit,
  });

  const amount = scaleAmount(quantity, currentServings, initialServings);

  const formattedAmount = onFormatIngredientAmount(amount, unitOfMeasure);

  return formattedAmount ? `${formattedAmount} ${description}` : description;
};
