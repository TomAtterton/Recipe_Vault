interface ConversionTable {
  [key: string]: {
    cup: number;
  };
}

export const conversionTableToGrams: ConversionTable = {
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

export const spoonSet = new Set([
  'tbsp.',
  'tsp.',
  'tbsp',
  'tsp',
  'tablespoons',
  'teaspoons',
  'tablespoon',
  'teaspoon',
]);

export const imperialSet = new Set([
  'cup',
  'cups',
  'pint',
  'pints',
  'quart',
  'quarts',
  'gallon',
  'gallons',
  'ounce',
  'ounces',
  'pound',
  'pounds',
  'c',
  'pt',
  'qt',
  'gal',
  'oz',
  'lb',
]);

export const metricSet = new Set([
  'ml',
  'mL',
  'milliliters',
  'millilitres',
  'milliliter',
  'millilitre',
  'l',
  'L',
  'liters',
  'litres',
  'liter',
  'litre',
  'g',
  'gram',
  'grams',
  'kg',
  'kilogram',
  'kilograms',
]);

export const instructionFilterWords: string[] = [
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
  'diced',
  // 'minced',
  // 'sliced',
  // 'grated',
  // 'crushed',
  // 'peeled',
  // 'cored',
  // 'seeded',
  // 'trimmed',
  // 'halved',
  // 'quartered',
  // 'cubed',
  // 'pitted',
  // 'shredded',
  // 'fresh',
  // 'frozen',
];
