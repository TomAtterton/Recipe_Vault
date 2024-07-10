import { SQLiteDatabase } from 'expo-sqlite/next';
import { Env } from '@/core/env';
import { useBoundStore } from '@/store';

export const initDatabase = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 1;

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
    const testGroupId = Env.TEST_GROUP_ID;
    // check if group exists
    const group = await db.getFirstAsync<{ id: string }>(
      `SELECT id FROM groups WHERE id = '${testGroupId}'`
    );
    if (!group) {
      await db.runAsync(
        `INSERT INTO groups (id, created_at, updated_at, name, is_modified) VALUES ('${testGroupId}', '2021-09-01T00:00:00.000Z', '2021-09-01T00:00:00.000Z', 'initial', 0)`
      );
    }
  }
};

export const createTables = async (db?: SQLiteDatabase) => {
  if (!db) throw new Error('Database not initialized');

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    name TEXT,
    is_modified INTEGER
  );
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    user_id TEXT,
    servings INTEGER,
    rating INTEGER,
    date_added TEXT,
    last_made TEXT,
    group_id TEXT,
    source TEXT,
    note TEXT,
    name TEXT,
    description TEXT,
    image TEXT,
    prep_time TEXT,
    cook_time TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS recipes_group_id ON recipes (group_id);
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    name TEXT,
    group_id TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS categories_group_id ON categories (group_id);
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    group_id TEXT,
    name TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS tags_group_id ON tags (group_id);
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS profile (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    is_modified INTEGER
  )
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS mealplans (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    date TEXT,
    group_id TEXT,
    recipe_id TEXT,
    title TEXT,
    type TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS mealplans_recipe_id ON mealplans (recipe_id);
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS recipe_instructions (
    id TEXT PRIMARY KEY,
    recipe_id TEXT,
    created_at TEXT,
    updated_at TEXT,
    group_id TEXT,
    section_title TEXT,
    sequence INTEGER,
    text TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS recipe_instructions_recipe_id ON recipe_instructions (recipe_id);
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS profile_groups (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    group_id TEXT,
    profile_id TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS profile_groups_profile_id ON profile_groups (profile_id);
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS recipe_categories (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    category_id TEXT,
    group_id TEXT,
    recipe_id TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS recipe_categories_recipe_id ON recipe_categories (recipe_id);
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS recipe_tags (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    group_id TEXT,
    tag_id TEXT,
    recipe_id TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS recipe_tags_recipe_id ON recipe_tags (recipe_id);
`);

  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    group_id TEXT,
    recipe_id TEXT,
    section_title TEXT,
    sequence INTEGER,
    text TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS recipe_ingredients_recipe_id ON recipe_ingredients (recipe_id);
`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS deleted_records (
      id TEXT PRIMARY KEY,
      created_at TEXT,
      updated_at TEXT,
      deleted_record_id TEXT,
      table_name TEXT,
      group_id TEXT,
      is_modified INTEGER,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS deleted_records_deleted_record_id ON deleted_records (deleted_record_id);
    `);
};

export const dropTables = async (db?: SQLiteDatabase) => {
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
