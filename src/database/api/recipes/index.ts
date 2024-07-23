import { RecipeDetails } from '@/database/types/recipes';
import { database } from '@/database';
import { sqlDelete, sqlExecute, sqlInsert, sqlUpdate, sqlGet } from '@/database/sql';
import { useBoundStore } from '@/store';
import { TableNames } from '@/database/api/types';
import { randomUUID } from 'expo-crypto';

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

export const getRecipeServings = async (recipe_id: string) => {
  try {
    const response = await sqlGet(SELECT_RECIPE_SERVINGS, [recipe_id]);
    // @ts-ignore
    return response?.servings || 1;
  } catch (error) {
    console.log('Error getting recipe servings', error);
    throw error;
  }
};

export const SELECT_TRY_SOMETHING =
  'SELECT id, name, description, rating, cook_time, image\n' +
  'FROM recipes \n' +
  'ORDER BY created_at DESC\n' +
  'LIMIT 5;';

// TODO this could be simplified
export const SELECT_RECIPE_DETAILS_JOINED = `SELECT
  r.*,
  ri.ingredients,
  rin.instructions,
  rt.tags,
  rc.categories
FROM
  recipes r
LEFT JOIN (
  SELECT
    recipe_id,
    json_group_array(json_object('id', id, 'text', text, 'section_title', section_title)) AS ingredients
  FROM
    recipe_ingredients
  GROUP BY
    recipe_id
) ri ON r.id = ri.recipe_id
LEFT JOIN (
  SELECT
    recipe_id,
    json_group_array(json_object('id', id, 'text', text, 'section_title', section_title)) AS instructions
  FROM
    recipe_instructions
  GROUP BY
    recipe_id
) rin ON r.id = rin.recipe_id
LEFT JOIN (
  SELECT
    recipe_id,
    json_group_array(json_object('tag_id', tag_id)) AS tags
  FROM
    recipe_tags
  GROUP BY
    recipe_id
) rt ON r.id = rt.recipe_id
LEFT JOIN (
  SELECT
    recipe_id,
    json_group_array(json_object('category_id', category_id)) AS categories
  FROM
    recipe_categories
  GROUP BY
    recipe_id
) rc ON r.id = rc.recipe_id
WHERE
  r.id = ?;
`;

export const updateRecipe = async ({
  recipe_id,
  group_id,
  user_id,
  name,
  description,
  imageUrl,
  prep_time,
  cook_time,
  servings,
  rating,
  source,
  note,
  last_made,
}: RecipeDetails) =>
  sqlUpdate(
    TableNames.recipes,
    {
      group_id,
      user_id,
      name,
      description,
      image: imageUrl,
      prep_time,
      cook_time,
      servings,
      rating,
      source,
      note,
      last_made,
    },
    recipe_id
  );

export const insertRecipe = async ({
  recipe_id,
  group_id,
  user_id,
  name,
  description,
  imageUrl,
  prep_time,
  cook_time,
  servings,
  rating,
  source,
  note,
  last_made,
}: RecipeDetails) =>
  sqlInsert(TableNames.recipes, {
    id: recipe_id,
    group_id,
    user_id,
    name,
    description,
    image: imageUrl,
    prep_time,
    cook_time,
    servings,
    rating,
    source,
    note,
    last_made,
  });

export const updateRelatedTable = async (tableName: string, data: any[], recipe_id: string) => {
  if (!data.length) return;

  try {
    await sqlDelete(tableName, recipe_id, 'recipe_id');

    const group_id = useBoundStore.getState().profile.groupId;
    const currentTimestamp = new Date().toISOString();
    const baseColumns = ['recipe_id', 'group_id', 'created_at', 'updated_at'];
    const baseValues = [recipe_id, group_id, currentTimestamp, currentTimestamp];
    let specificColumns: string[] = [];
    let values: string[] = [];
    let placeholders: string[] = [];

    data.forEach((item, index) => {
      let itemValues;
      switch (tableName) {
        case 'recipe_ingredients':
        case 'recipe_instructions':
          specificColumns = ['section_title', 'text', 'id', 'is_modified', 'sequence'];
          itemValues = [item.section_title || '', item.text, item.id, true, index];
          break;
        case 'recipe_categories':
          specificColumns = ['id', 'category_id', 'is_modified'];
          itemValues = [randomUUID(), item.category_id, true];
          break;
        case 'recipe_tags':
          specificColumns = ['id', 'tag_id', 'is_modified'];
          itemValues = [randomUUID(), item.tag_id, true];
          break;
        default:
          throw new Error(`Unsupported table name: ${tableName}`);
      }

      values.push(...baseValues, ...itemValues);
      placeholders.push(
        `(${new Array(baseValues.length + itemValues.length).fill('?').join(',')})`
      );
    });

    const columns = [...baseColumns, ...specificColumns].join(', ');
    const placeholdersString = placeholders.join(', ');
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES ${placeholdersString}`;

    await sqlExecute(sql, values);
  } catch (error) {
    console.log('Error updating related table', error);
    throw error;
  }
};
