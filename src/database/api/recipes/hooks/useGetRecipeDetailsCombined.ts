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
import {
  TCategoriesDatabase,
  TRecipeCategoriesDatabase,
  TRecipeDetailsDatabase,
  TRecipeIngredientsDatabase,
  TRecipeInstructionsDatabase,
  TRecipeTagsDatabase,
  TTagsDatabase,
} from '@/database/types/recipes';
import { showErrorMessage } from '@/utils/promptUtils';
import { translate } from '@/core';

const useGetRecipeDetailsCombined = ({ id }: { id?: string | null }) => {
  const [recipeData, setRecipeData] = useState<RecipeDetailType>();

  useEffect(() => {
    const fetchRecipeDetails = () => {
      try {
        if (!id) return;
        if (!database) return;

        database.withTransactionSync(() => {
          if (!database) return;
          Promise.all([
            database.getFirstSync(SELECT_RECIPE_DETAILS, id) as TRecipeDetailsDatabase,
            database.getAllSync(SELECT_RECIPE_INGREDIENTS, id) as TRecipeIngredientsDatabase[],
            database.getAllSync(SELECT_RECIPE_INSTRUCTIONS, id) as TRecipeInstructionsDatabase[],
            database.getAllSync(SELECT_RECIPE_CATEGORIES, id) as TRecipeCategoriesDatabase[],
            database.getAllSync(SELECT_RECIPE_TAGS, id) as TRecipeTagsDatabase[],
            database.getAllSync(SELECT_CATEGORIES) as TCategoriesDatabase,
            database.getAllSync(SELECT_TAGS) as TTagsDatabase,
          ]).then(
            ([
              recipe,
              ingredients,
              instructions,
              recipeCategories,
              recipeTags,
              categories,
              tags,
            ]) => {
              const data = {
                ...recipe,
                recipe_ingredients: ingredients || [],
                recipe_instructions: instructions || [],
                recipe_tags: recipeTags || [],
                recipe_categories: recipeCategories || [],
              };

              const transformedData = transformData(data, categories, tags);
              console.log('transformedData', transformedData);
              setRecipeData(transformedData);
            },
          );
        });
      } catch (error) {
        showErrorMessage(translate('recipe_details.error_fetching_details'));
        console.log(translate('recipe_details.error_fetching_details'), error);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  return {
    data: recipeData,
    isLoading: false,
    isError: null,
    refetch: () => {},
  };
};

export const transformData = (
  recipe: TRecipeDetailsDatabase,
  categories: TCategoriesDatabase,
  tags: TTagsDatabase,
) =>
  ({
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
    recipeIngredient: recipe.recipe_ingredients.map((ingredient) => {
      return {
        id: ingredient.id,
        text: ingredient.text,
        isEditing: false,
        title: ingredient.section_title,
      };
    }),
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
  }) as RecipeDetailType;

export default useGetRecipeDetailsCombined;
