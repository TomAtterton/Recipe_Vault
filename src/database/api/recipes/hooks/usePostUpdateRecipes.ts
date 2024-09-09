import { randomUUID } from 'expo-crypto';
import { useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { insertRecipe, updateRecipe, updateRelatedTable } from '@/database/api/recipes';
import { checkMetaDataDuplicates } from '@/database/api/recipes/helpers/postRecipeHelper';
import useHandlePaywall from '@/hooks/common/useHandlePaywall';
import { getUserId } from '@/hooks/common/useUserId';
import { sqlDelete } from '@/database/sql';
import { uploadImage } from '@/services/image';
import { RecipeDetailType } from '@/types';
import { TRecipeDatabase } from '@/database/types/recipes';

const usePostUpdateRecipes = () => {
  const { onCanAddRecipe } = useHandlePaywall();

  const onSubmit = async (
    values: RecipeDetailType,
    id?: string | null,
    previousValues?: RecipeDetailType | null,
  ) => {
    try {
      // We are editing an existing recipe so no need to check for paywall
      if (!id) {
        await onCanAddRecipe();
      }

      const recipe_id = id || randomUUID();

      const imageUrl = await uploadImage({
        uri: values?.image || '',
        recipeId: recipe_id,
      });

      const { instructions, ingredients, categories, tags } = checkMetaDataDuplicates(
        values,
        previousValues,
      );

      const groupId = useBoundStore.getState().profile.groupId;
      const userId = getUserId();

      const recipeDetails: TRecipeDatabase = {
        id: recipe_id,
        group_id: groupId || Env.TEST_GROUP_ID,
        user_id: userId || Env.TEST_USER_ID,
        name: values.name,
        description: values.description,
        image: imageUrl,
        prep_time: values?.prepTime || null,
        cook_time: values?.performTime || null,
        servings: values.servings || 1,
        rating: values?.rating || 0,
        source: values?.source || '',
        note: values?.note || '',
        last_made: values?.lastMade || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        date_added: null,
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
    }
  };

  return {
    onSubmit,
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
  recipeDetails: TRecipeDatabase;
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
    },
  ) => {
    await updateRelatedTable({
      tableName: table,
      data: data.changed,
      recipe_id: recipeDetails.id,
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
