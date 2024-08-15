import { useState } from 'react';
import { randomUUID } from 'expo-crypto';
import onImageUpload from '@/database/api/storage/useImageUpload';
import { useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { insertRecipe, updateRecipe, updateRelatedTable } from '@/database/api/recipes';
import {
  Category,
  checkMetaDataDuplicates,
  Ingredient,
  Instruction,
  Tag,
} from '@/database/api/recipes/helpers/postRecipeHelper';
import { database } from '@/database';
import useHandlePaywall from '@/hooks/common/useHandlePaywall';
import { getUserId } from '@/hooks/common/useUserId';

// Extend or modify these as needed to match your exact schema and requirements
interface RecipeDetails {
  recipe_id: string;
  group_id: string | null;
  user_id: string | null;
  name: string;
  description: string;
  imageUrl: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  rating: number;
  source: string;
  note: string;
  last_made: Date | null;
}

export type RecipeDetailType = {
  id: string;
  userId: string;
  name: string;
  description: string;
  rating?: number | null;
  dateAdded?: string | null;
  dateUpdated?: string | null;
  image?: string | null;
  note?: string | null;
  lastMade?: string | null;
  source?: string | null;
  performTime?: string | null;
  prepTime?: string | null;
  servings?: number | null;
  recipeTags?: {
    id: string;
    name?: string | null;
  }[];
  recipeCategory?: {
    id: string;
    name?: string | null;
  }[];
  recipeIngredient?: {
    title?: string | null;
    id: string;
    text: string;
    // isEditing: boolean;
    // TODO fix this weird naming
    type?: 'section' | 'ingredient'; // Add the type property to Ingredient type
  }[];
  recipeInstructions?: {
    title?: string | null;
    id: string;
    text: string;
    // TODO fix this weird naming
    type?: 'section' | 'ingredient'; // Add the type property to Ingredient type
  }[];
};

const usePostUpdateRecipes = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { onCanAddRecipe } = useHandlePaywall();

  const onSubmit = async (
    values: Partial<RecipeDetailType>,
    id?: string | null,
    previousValues?: Partial<RecipeDetailType>
  ) => {
    try {
      await onCanAddRecipe();

      setIsLoading(true);
      const imageUrl = await onImageUpload(values?.image, previousValues?.image);

      const { instructions, ingredients, categories, tags } = checkMetaDataDuplicates(
        values,
        previousValues
      );

      const groupId = useBoundStore.getState().profile.groupId;
      const userId = getUserId();

      const recipe_id = id || randomUUID();

      const recipeDetails: any = {
        recipe_id,
        group_id: groupId || Env.TEST_GROUP_ID,
        user_id: userId || Env.TEST_USER_ID,
        name: values.name,
        description: values.description,
        imageUrl: imageUrl,
        prep_time: values.prepTime,
        cook_time: values.performTime,
        servings: values.servings || 1,
        rating: values.rating,
        source: values.source,
        note: values.note,
        last_made: values?.lastMade,
      };

      await updateRecipeAndRelatedTables({
        recipeDetails,
        ingredients,
        instructions,
        categories,
        tags,
        hasExistingRecipe: !!previousValues,
      });

      setIsLoading(false);
      return recipe_id;
    } catch (error) {
      // @ts-ignore
      console.error('Error updating recipe', error?.message);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    onSubmit,
    isLoading,
  };
};

async function updateRecipeAndRelatedTables({
  recipeDetails,
  ingredients,
  instructions,
  categories,
  tags,
  hasExistingRecipe,
}: {
  recipeDetails: RecipeDetails;
  ingredients: Ingredient[] | undefined[];
  instructions: Instruction[] | undefined[];
  categories: Category[] | undefined[];
  tags: Tag[] | undefined[];
  hasExistingRecipe: boolean;
}) {
  try {
    await database?.withTransactionAsync(async () => {
      // Insert or Update Recipe
      await insertOrUpdateRecipe(recipeDetails, hasExistingRecipe);
      // Shared recipe_id, assumed to be part of recipeDetails
      const recipe_id = recipeDetails.recipe_id;
      // Delete existing related records and insert new ones
      if (ingredients && ingredients.length > 0) {
        await updateRelatedTable('recipe_ingredients', ingredients, recipe_id);
      }

      if (instructions && instructions.length > 0) {
        await updateRelatedTable('recipe_instructions', instructions, recipe_id);
      }

      if (categories && categories.length > 0) {
        await updateRelatedTable('recipe_categories', categories, recipe_id);
      }

      if (tags && tags.length > 0) {
        await updateRelatedTable('recipe_tags', tags, recipe_id);
      }
    });
  } catch (error) {
    throw error;
  }
}

async function insertOrUpdateRecipe(recipeDetails: RecipeDetails, hasExistingRecipe: boolean) {
  try {
    if (hasExistingRecipe) {
      // Update existing recipe
      await updateRecipe(recipeDetails);
    } else {
      // Insert new recipe
      await insertRecipe(recipeDetails);
    }
  } catch (error) {
    throw error; // Rethrow the error for further handling
  }
}

export default usePostUpdateRecipes;
