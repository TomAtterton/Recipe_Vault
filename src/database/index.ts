import { openDatabaseAsync, SQLiteDatabase, SQLiteOpenOptions } from 'expo-sqlite/next';
import { useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { sqlInsert } from '@/database/sql';
import {
  createCategoriesTable,
  createGroupsTable,
  createMealPlansTable,
  createProfileGroupsTable,
  createProfileTable,
  createRecipeCategoriesTable,
  createRecipeIngredientsTable,
  createRecipeInstructionsTable,
  createRecipesTable,
  createRecipeTagsTable,
  createTagsTable,
} from '@/database/tables';
import { createDeletedRecordsTable } from '@/database/tables/DeletedRecordsTable';

export let database: SQLiteDatabase | undefined;

export const setDatabase = (db: SQLiteDatabase | undefined) => {
  database = db;
};

const DATABASE_VERSION = 2;

const initDatabase = async (db: SQLiteDatabase) => {
  // Always set these PRAGMA statements for each session
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');
  // @ts-ignore
  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  await createTables(db);
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  const shouldSync = useBoundStore.getState().shouldSync;

  if (!shouldSync) {
    const initialGroupId = Env.TEST_GROUP_ID;
    const initialGroup = await database?.getFirstAsync<{
      id: string;
    }>(`SELECT id FROM groups WHERE id = '${initialGroupId}'`);
    if (!initialGroup) {
      await sqlInsert('groups', { id: initialGroupId });
    }
  }
};

const createTables = async (db?: SQLiteDatabase) => {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.withExclusiveTransactionAsync(async (tx) => {
      await tx.execAsync(createGroupsTable);
      await tx.execAsync(createRecipesTable);
      await tx.execAsync(createCategoriesTable);
      await tx.execAsync(createTagsTable);
      await tx.execAsync(createProfileTable);
      await tx.execAsync(createMealPlansTable);
      await tx.execAsync(createRecipeInstructionsTable);
      await tx.execAsync(createProfileGroupsTable);
      await tx.execAsync(createRecipeCategoriesTable);
      await tx.execAsync(createRecipeTagsTable);
      await tx.execAsync(createRecipeIngredientsTable);
      await tx.execAsync(createDeletedRecordsTable);
    });
  } catch (e) {
    console.log('error creating tables', e);
    throw e;
  }
};

export const onOpenDatabase = async ({
  currentDatabaseName,
  shouldClose = true,
  options,
}: {
  currentDatabaseName: string;
  shouldClose?: boolean;
  options?: SQLiteOpenOptions;
}) => {
  try {
    if (database && shouldClose) {
      database?.closeSync();
    }

    const newDatabase = await openDatabaseAsync(`${currentDatabaseName}.db`, {
      enableChangeListener: true,
      ...options,
    });
    setDatabase(newDatabase);
    await initDatabase(newDatabase);
  } catch (e) {
    console.log('error opening database', e);
    throw e;
  }
};

export const onDeleteDatabase = async (db?: SQLiteDatabase) => {
  try {
    if (!db) throw new Error('Database not initialized');
    console.log('Wiping Database', db);

    // List of tables to be dropped
    const tables = [
      'recipes',
      'categories',
      'tags',
      'mealplans',
      'recipe_instructions',
      'profile_groups',
      'recipe_categories',
      'recipe_tags',
      'recipe_ingredients',
      'deleted_records',
    ];

    await db.withExclusiveTransactionAsync(async (txn) => {
      for (const table of tables) {
        await txn.runAsync(`DELETE from ${table}`);
      }

      await txn.runAsync('PRAGMA user_version = 0');
    });
  } catch (e) {
    console.log('error dropping tables', e);
    throw e;
  }
};
