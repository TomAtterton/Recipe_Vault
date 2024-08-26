import { optional, z } from 'zod';
import { RecipeDetailType } from '@/types';
import { randomUUID } from 'expo-crypto';
import { UseControllerProps } from 'react-hook-form';

export type RecipeFormType = z.infer<typeof recipeFormSchema>;
export type controlType = UseControllerProps<any>['control'];
export type controlNameType = keyof RecipeFormType;

export const recipeFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  imageUrl: z.string().nullish(),
  description: z.string(),
  servings: z.number(),
  recipeIngredient: z
    .array(
      z.object({
        id: z.string(),
        title: z.optional(z.string()).nullish(),
        text: z.string(),
        type: z.union([z.literal('section'), z.literal('ingredient')]).optional(),
      })
    )
    .nonempty('Ingredients are required.'),
  recipeInstructions: z
    .array(
      z.object({
        id: z.string(),
        title: z.optional(z.string()).nullish(),
        text: z.string(),
        type: optional(z.string()),
      })
    )
    .nonempty('Instructions are required.'),
  prepTime: z
    .optional(
      z
        .string()
        .refine(
          (value) =>
            value === '' ||
            value === null ||
            value === 'none' ||
            /^(?:(\d+)\s+hours?|hour)?\s*(?:(\d+)\s+minutes?|minute)?$/i.test(value),
          {
            message:
              'Invalid prep time format. Use a number followed by a period and a unit (e.g., "minutes", "hours"). Or none',
          }
        )
    )
    .nullish(),
  cookTime: z.optional(
    z
      .string()
      .refine(
        (value) =>
          value === '' ||
          value === null ||
          value === 'none' ||
          /^(?:(\d+)\s+hours?|hour)?\s*(?:(\d+)\s+minutes?|minute)?$/i.test(value),
        {
          message:
            'Invalid cook time format. Use a number followed by a period and a unit (e.g., "minutes", "hours"). Or none',
        }
      )
      .nullish()
  ),

  source: z.optional(z.string()).nullish(),
  rating: z.optional(z.number()).nullish(),
  recipeCategory: z
    .optional(
      z.array(
        z.object({
          id: z.optional(z.string()).nullish(),
          name: z.optional(z.string()).nullish(),
        })
      )
    )
    .nullish(),
  recipeTags: z
    .optional(
      z.array(
        z.object({
          id: z.optional(z.string()).nullish(),
          name: z.optional(z.string()).nullish(),
        })
      )
    )
    .nullish(),
  note: z.optional(z.string()).nullish(),
});

export type DraggableListItem = {
  id: string;
  title?: string | null;
  text: string;
  type?: 'section' | 'ingredient'; // Add the type property to Ingredient type
};

export const generateSectionData = (data: any[]) => {
  const draggableListItems: DraggableListItem[] = [];
  const sections = new Set<string>();

  data.forEach((item) => {
    const { id, title, text } = item;

    if (title && !sections.has(title)) {
      sections.add(title);
      draggableListItems.push({
        id: randomUUID(),
        title,
        text: '',
        type: 'section',
      });
    }

    draggableListItems.push({
      id: id || randomUUID(),
      title,
      text,
      type: 'ingredient',
    });
  });

  return draggableListItems;
};

export const defaultValues = {
  title: '',
  description: '',
  imageUrl: '',
  servings: 1,
  recipeIngredient: [],
  recipeInstructions: [],
  prepTime: '',
  cookTime: '',
  note: '',
  source: '',
  rating: 0,
  recipeCategory: [],
  recipeTags: [],
};

export const transformDefaultValues = (data?: RecipeDetailType) => {
  return {
    title: data?.name || '',
    imageUrl: data?.image || '',
    description: data?.description || '',
    servings: data?.servings || 1,
    prepTime: data?.prepTime || '',
    cookTime: data?.performTime || '',
    recipeIngredient: generateSectionData(data?.recipeIngredient || []),
    recipeInstructions: generateSectionData(data?.recipeInstructions || []),
    recipeCategory: data?.recipeCategory || [],
    recipeTags: data?.recipeTags || [],
    note: data?.note || '',
    source: data?.source || '',
    rating: data?.rating || 0,
  };
};

export const parseSectionData = (data: any[]) => {
  let currentSectionTitle = null;
  const filteredData = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    if (item.type === 'section') {
      currentSectionTitle = item.title;
    } else {
      if (currentSectionTitle !== null) {
        item.title = currentSectionTitle;
      }
      filteredData.push({
        title: currentSectionTitle,
        text: item.text,
        id: item.id || randomUUID(),
      });
    }
  }
  return filteredData;
};
