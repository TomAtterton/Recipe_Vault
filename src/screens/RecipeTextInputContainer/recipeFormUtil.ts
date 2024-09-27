import { randomUUID } from 'expo-crypto';
import { Ingredient, Instruction } from '@/types';
import { DraggableListItem, RecipeFormType } from '@/utils/recipeFormUtil';

export type RecipeTextPasteDataType = string | Ingredient[] | Instruction[];

export const formatText = (text: string): string =>
  text
    .split('\n')
    .filter((_) => _)
    .map((_) =>
      _.replace(/•/g, '')
        .replace(/^\d+\./g, '')
        .trim(),
    )
    .join('\n');

export const parseTextToData = (id: keyof RecipeFormType, value: string) => {
  const formatValue = formatText(value);
  switch (id) {
    case 'recipeIngredient': {
      const newIngredients = formatValue
        .split('\n')
        .map((ingredient) => {
          const isSection = ingredient.includes(':');
          return {
            title: isSection ? ingredient : '',
            id: randomUUID(),
            text: isSection ? '' : ingredient,
            type: isSection ? 'section' : 'ingredient',
          };
        })
        .filter((ingredient) => ingredient) as Ingredient[];
      return newIngredients as Ingredient[];
    }
    case 'recipeInstructions': {
      const newInstructions = formatValue.split('\n').map((instruction) => {
        const isSection = instruction.includes(':');

        return {
          title: isSection ? instruction : '',
          id: randomUUID(),
          text: isSection ? '' : instruction,
          type: isSection ? 'section' : 'ingredient',
        };
      }) as Instruction[];

      const filteredInstructions = newInstructions.filter(
        (instruction) => instruction !== undefined,
      );

      return filteredInstructions as Instruction[];
    }
    default:
      return '';
  }
};
export const onConvertIngredientInstructionToText = (itemState: DraggableListItem[]) => {
  return itemState
    .map((_) => {
      if (_.type === 'section') {
        const sectionTitle = _.title;
        if (sectionTitle?.endsWith(':')) {
          return sectionTitle;
        }
        return sectionTitle + ':';
      }
      return _.text;
    })
    .join('\n');
};
