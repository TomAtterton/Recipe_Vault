import { useEffect, useState } from 'react';
import { RecipeDetailType } from '@/types';
import {
  SELECT_RECIPE_CATEGORIES,
  SELECT_RECIPE_DETAILS,
  SELECT_RECIPE_INGREDIENTS,
  SELECT_RECIPE_INSTRUCTIONS,
  SELECT_RECIPE_TAGS,
} from '@/database/api/recipes';
import { database } from '@/database';
import { SELECT_CATEGORIES } from '@/database/api/categories';
import { SELECT_TAGS } from '@/database/api/tags';

type RecipeTransformType = {
  id: string;
  name: string;
  user_id: string;
  description: string;
  rating: number | null;
  date_added: string | null;
  created_at: string | null;
  image: string | null;
  note: string | null;
  last_made: string | null;
  source: string | null;
  cook_time: string | null;
  prep_time: string | null;
  servings: number | null;
  recipe_ingredients: { id: string; text: string; section_title: string | null }[];
  recipe_instructions: { id: string; text: string; section_title: string | null }[];
  recipe_tags: { tag_id: string | null }[];
  recipe_categories: { category_id: string | null }[];
};

const useGetRecipeDetailsCombined = ({ id }: { id?: string | null }) => {
  const [recipeData, setRecipeData] = useState<RecipeDetailType | {}>({});

  useEffect(() => {
    Promise.all([
      database?.getFirstSync(SELECT_RECIPE_DETAILS, [id || '']),
      database?.getAllSync(SELECT_RECIPE_INGREDIENTS, [id || '']),
      database?.getAllSync(SELECT_RECIPE_INSTRUCTIONS, [id || '']),
      database?.getAllSync(SELECT_RECIPE_CATEGORIES, [id || '']),
      database?.getAllSync(SELECT_RECIPE_TAGS, [id || '']),
      database?.getAllSync(SELECT_CATEGORIES, []),
      database?.getAllSync(SELECT_TAGS, []),
    ]).then(
      ([recipe, ingredients, instructions, recipeCategories, recipeTags, categories, tags]) => {
        const data = {
          ...(recipe || {}),
          recipe_ingredients: ingredients,
          recipe_instructions: instructions,
          recipe_tags: recipeTags,
          recipe_categories: recipeCategories,
        } as RecipeTransformType;
        const transformedData = transformData(data, categories, tags);
        setRecipeData(transformedData);
      }
    );
  }, [id]);

  return {
    data: recipeData,
    isLoading: false,
    isError: null,
    refetch: () => {},
  };
};
export const transformData = (
  recipe: RecipeTransformType,
  categories: any[] | null | undefined,
  tags: any[] | null | undefined
) => ({
  id: recipe.id,
  userId: recipe.user_id,
  name: recipe.name,
  description: recipe.description,
  rating: recipe.rating,
  dateAdded: recipe.date_added,
  dateUpdated: recipe.created_at,
  image: recipe.image,
  note: recipe.note,
  lastMade: recipe.last_made,
  source: recipe.source,
  performTime: recipe.cook_time,
  prepTime: recipe.prep_time,
  servings: recipe.servings,
  // @ts-ignore
  recipeIngredient: recipe.recipe_ingredients.map((ingredient) => {
    return {
      id: ingredient.id,
      text: ingredient.text,
      isEditing: false,
      title: ingredient.section_title,
    };
  }),
  // @ts-ignore
  recipeInstructions: recipe.recipe_instructions.map((instruction) => {
    return {
      id: instruction.id,
      text: instruction.text,
      isEditing: false,
      title: instruction.section_title,
    };
  }),
  recipeTags: recipe.recipe_tags?.map((tag) => {
    const tagDetail = tags?.find((_) => _.id === tag.tag_id);
    return {
      id: tag.tag_id,
      name: tagDetail?.name,
    };
  }),
  recipeCategory: recipe.recipe_categories?.map((category) => {
    const categoryDetail = categories?.find((_) => _.id === category.category_id);

    return {
      id: category.category_id,
      name: categoryDetail?.name,
    };
  }),
});

export default useGetRecipeDetailsCombined;
