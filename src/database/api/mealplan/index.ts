import { sqlDelete, sqlInsert } from '@/database/sql';
import { TableNames } from '@/database/api/types';
import { randomUUID } from 'expo-crypto';

export const SELECT_MEALPLANS = `SELECT mealplans.id, mealplans.title, mealplans.date, mealplans.type, mealplans.recipe_id, recipes.name, recipes.image, recipes.servings FROM mealplans JOIN recipes ON mealplans.recipe_id = recipes.id WHERE mealplans.date >= ? AND mealplans.date <= ?;`;

export const deleteMealplans = async ({ id }: { id: string }) =>
  sqlDelete(TableNames.mealplans, id);

export const insertMealplan = async ({
  title,
  type,
  date,
  group_id,
  recipe_id,
}: {
  title: string;
  type: string;
  date: string;
  group_id: string;
  recipe_id: string;
}) =>
  sqlInsert(TableNames.mealplans, {
    id: randomUUID(),
    title,
    type,
    date,
    group_id,
    recipe_id,
  });
