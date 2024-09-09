import { database } from '@/database';
import { sqlDelete, sqlExecute, sqlInsert, sqlUpdate, sqlGet } from '@/database/sql';
import { useBoundStore } from '@/store';
import { TableNames } from '@/database/api/types';
import { randomUUID } from 'expo-crypto';
import { TRecipeDatabase } from '@/database/types/recipes';

export const deleteRecipe = async ({ id }: { id: string }) => sqlDelete(TableNames.recipes, id);

export const SELECT_RECIPE_DETAILS = `SELECT * FROM recipes WHERE id = ?;`;
export const SELECT_RECIPE_SERVINGS = `SELECT servings FROM recipes WHERE id = ?;`;

export const SELECT_RECIPE_INGREDIENTS = `SELECT * FROM recipe_ingredients WHERE recipe_id = ? ORDER BY sequence;`;
export const SELECT_RECIPE_INSTRUCTIONS = `SELECT * FROM recipe_instructions WHERE recipe_id = ? ORDER BY sequence;`;

export const SELECT_RECIPE_CATEGORIES = `SELECT * FROM recipe_categories WHERE recipe_id = ?;`;
export const SELECT_RECIPE_TAGS = `SELECT * FROM recipe_tags WHERE recipe_id = ?;`;

export const getRecipeCount = async () => {
  const result = await database?.getFirstAsync('SELECT count(*) as count FROM recipes');
  // @ts-ignore
  return result?.count || 0;
};

export const getRecipeServings = async (recipe_id?: string | null) => {
  try {
    if (!recipe_id) throw new Error('No recipe id provided');
    const response = await sqlGet(SELECT_RECIPE_SERVINGS, [recipe_id]);
    // @ts-ignore
    return response?.servings || 1;
  } catch (error) {
    console.log('Error getting recipe servings', error);
    throw error;
  }
};

export const SELECT_TRY_SOMETHING =
  'SELECT id, name, description, rating, cook_time, servings, image\n' +
  'FROM recipes \n' +
  'ORDER BY created_at DESC\n' +
  'LIMIT 5;';

export const updateRecipe = async ({
  id: recipe_id,
  group_id,
  user_id,
  name,
  description,
  image,
  prep_time,
  cook_time,
  servings,
  rating,
  source,
  note,
  last_made,
}: TRecipeDatabase) =>
  sqlUpdate(
    TableNames.recipes,
    {
      group_id,
      user_id,
      name,
      description,
      image,
      prep_time,
      cook_time,
      servings,
      rating,
      source,
      note,
      last_made,
    },
    recipe_id,
  );

export const insertRecipe = async ({
  id: recipe_id,
  group_id,
  user_id,
  name,
  description,
  image,
  prep_time,
  cook_time,
  servings,
  rating,
  source,
  note,
  last_made,
}: TRecipeDatabase) =>
  sqlInsert(TableNames.recipes, {
    id: recipe_id,
    group_id,
    user_id,
    name,
    description,
    image,
    prep_time,
    cook_time,
    servings,
    rating,
    source,
    note,
    last_made,
  });

export const updateRelatedTable = async ({
  tableName,
  data,
  recipe_id,
}: {
  tableName: string;
  data?: any[];
  recipe_id: string;
}) => {
  if (data && data.length === 0) return;
  console.log('test');
  try {
    const group_id = useBoundStore.getState().profile.groupId;
    const currentTimestamp = new Date().toISOString();
    const baseColumns = ['recipe_id', 'group_id', 'created_at', 'updated_at'];
    const baseValues = [recipe_id, group_id, currentTimestamp, currentTimestamp];
    let specificColumns: string[] = [];
    let values: string[] = [];
    let placeholders: string[] = [];

    data?.forEach((item, index) => {
      let itemValues;
      switch (tableName) {
        case 'recipe_ingredients':
        case 'recipe_instructions':
          specificColumns = ['id', 'section_title', 'text', 'is_modified', 'sequence'];
          itemValues = [item?.id, item?.section_title || '', item.text, true, index];
          break;
        // These values are always inserted never updated
        case 'recipe_categories':
          specificColumns = ['id', 'category_id', 'is_modified'];
          itemValues = [randomUUID(), item?.category_id, true];
          break;
        case 'recipe_tags':
          specificColumns = ['id', 'tag_id', 'is_modified'];
          itemValues = [randomUUID(), item?.tag_id, true];
          break;
        default:
          throw new Error(`Unsupported table name: ${tableName}`);
      }

      values.push(...baseValues, ...itemValues);
      placeholders.push(
        `(${new Array(baseValues.length + itemValues.length).fill('?').join(',')})`,
      );
    });

    const columns = [...baseColumns, ...specificColumns].join(', ');
    const placeholdersString = placeholders.join(', ');

    const sql = `
      INSERT OR REPLACE INTO ${tableName} (${columns})
      VALUES ${placeholdersString}
    `;

    await sqlExecute(sql, values);
  } catch (error) {
    console.log('Error updating related table', error);
    throw error;
  }
};
