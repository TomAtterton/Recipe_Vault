import { useState } from 'react';
import { randomUUID } from 'expo-crypto';
import { useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { insertRecipe, updateRecipe, updateRelatedTable } from '@/database/api/recipes';
import { checkMetaDataDuplicates } from '@/database/api/recipes/helpers/postRecipeHelper';
import useHandlePaywall from '@/hooks/common/useHandlePaywall';
import { getUserId } from '@/hooks/common/useUserId';
import { sqlDelete } from '@/database/sql';
import { uploadImage } from '@/services/image';

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
      // We are editing an existing recipe so no need to check for paywall
      if (!id) {
        await onCanAddRecipe();
      }

      setIsLoading(true);
      const recipe_id = id || randomUUID();

      const imageUrl = await uploadImage({
        uri: values?.image || '',
        recipeId: recipe_id,
      });

      const { instructions, ingredients, categories, tags } = checkMetaDataDuplicates(
        values,
        previousValues
      );

      const groupId = useBoundStore.getState().profile.groupId;
      const userId = getUserId();

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

      return recipe_id;
    } catch (error) {
      // @ts-ignore
      console.error('Error updating recipe', error?.message);
      throw error;
    } finally {
      setIsLoading(false);
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
  ingredients: any;
  instructions: any;
  categories: any;
  tags: any;
  hasExistingRecipe: boolean;
}) {
  const deleteRelatedRecords = async (table: string, items: any[]) => {
    if (items && items.length > 0) {
      const key = () => {
        switch (table) {
          case 'recipe_categories':
            return 'category_id';
          case 'recipe_tags':
            return 'tag_id';
          default:
            return 'id';
        }
      };
      await Promise.all(items.map((item) => item?.id && sqlDelete(table, item.id, key())));
    }
  };

  const updateRelatedRecords = async (
    table: string,
    data: {
      changed: any[];
      deleted: any[];
    }
  ) => {
    await updateRelatedTable({
      tableName: table,
      data: data.changed,
      recipe_id: recipeDetails.recipe_id,
    });
    await deleteRelatedRecords(table, data.deleted);
  };

  try {
    await (hasExistingRecipe ? updateRecipe(recipeDetails) : insertRecipe(recipeDetails));

    await Promise.all([
      updateRelatedRecords('recipe_ingredients', ingredients),
      updateRelatedRecords('recipe_instructions', instructions),
      updateRelatedRecords('recipe_categories', categories),
      updateRelatedRecords('recipe_tags', tags),
    ]);
  } catch (error) {
    console.error('Error in updateRecipeAndRelatedTables', error);
    throw error;
  }
}

export default usePostUpdateRecipes;
