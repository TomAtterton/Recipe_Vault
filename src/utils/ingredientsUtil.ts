import convert from 'convert';
import { parseIngredient } from 'parse-ingredient';

const unitsSet = new Set(['tbsp', 'tsp', 'tablespoons', 'teaspoons', 'tablespoon', 'teaspoon']);

export const parseMetrics = ({ note, isMetric }: { note: string; isMetric: boolean }): any | {} => {
  const parsedIngredient = note ? parseIngredient(note)[0] : null;
  if (!parsedIngredient) return {};

  const { quantity, unitOfMeasure, description } = parsedIngredient;
  if (quantity && unitOfMeasure) {
    try {
      let value = {
        quantity,
        unit: unitOfMeasure,
      };

      if (!unitsSet.has(unitOfMeasure)) {
        value = convert(quantity, unitOfMeasure as any).to(
          'best',
          isMetric ? 'metric' : 'imperial',
        );
      }

      if (unitOfMeasure === 'cup') {
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

interface ConversionTable {
  [key: string]: {
    cup: number;
  };
}

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

const conversionTableToGrams: ConversionTable = {
  butter: { cup: 227 },
  'brown sugar': { cup: 198 },
  'powdered sugar': { cup: 113 },
  sugar: { cup: 198 },
  'whole wheat flour': { cup: 156 },
  flour: { cup: 142 },
  vanilla: { cup: 208 },
  milk: { cup: 240 },
  cornstarch: { cup: 125 },
  'olive oil': { cup: 216 },
  yogurt: { cup: 230 },
  oil: { cup: 198 },
  water: { cup: 237 },
  cocoa: { cup: 85 },
  cornmeal: { cup: 138 },
  'granulated sugar': { cup: 200 },
  honey: { cup: 340 },
  'maple syrup': { cup: 320 },
  'brown rice': { cup: 195 },
  quinoa: { cup: 185 },
  pasta: { cup: 200 },
  'rolled oats': { cup: 90 },
  'almond flour': { cup: 96 },
  'ground cinnamon': { cup: 120 },
  'snap pea': { cup: 98 },
  salt: { cup: 273 },
  'baking powder': { cup: 192 },
  'baking soda': { cup: 220 },
  cinnamon: { cup: 126 },
  nutmeg: { cup: 116 },
  'cocoa powder': { cup: 85 },
  'cayenne pepper': { cup: 93 },
  'black pepper': { cup: 143 },
  'white sugar': { cup: 200 },
  'brown rice flour': { cup: 156 },
  'coconut flour': { cup: 96 },
  'potato starch': { cup: 160 },
  'tapioca flour': { cup: 120 },
  'almond meal': { cup: 96 },
  'coconut oil': { cup: 216 },
  'peanut butter': { cup: 258 },
  'sesame oil': { cup: 216 },
  molasse: { cup: 336 },
  'corn syrup': { cup: 320 },
  'flaxseed meal': { cup: 88 },
  'sunflower seed': { cup: 128 },
  'chia seed': { cup: 168 },
  'cumin seed': { cup: 121 },
  'mustard seed': { cup: 120 },
  'poppy seed': { cup: 128 },
  'quinoa flour': { cup: 130 },
  'amaranth flour': { cup: 120 },
  'buckwheat flour': { cup: 128 },
  'millet flour': { cup: 120 },
  'teff flour': { cup: 128 },
  'almond butter': { cup: 258 },
  'cashew butter': { cup: 254 },
  'pecan butter': { cup: 260 },
};
