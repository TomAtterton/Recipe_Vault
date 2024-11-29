// export const createCategoriesTable = `
//   CREATE TABLE IF NOT EXISTS categories (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     name TEXT,
//     group_id TEXT,
//     is_modified INTEGER,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
//   );
//   CREATE INDEX IF NOT EXISTS categories_group_id ON categories (group_id);
// `;
//
// export const createDeletedRecordsTable = `
//     CREATE TABLE IF NOT EXISTS deleted_records (
//       id TEXT PRIMARY KEY,
//       created_at TEXT,
//       updated_at TEXT,
//       deleted_record_id TEXT,
//       table_name TEXT,
//       group_id TEXT,
//       is_modified INTEGER,
//       FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
//     );
//     CREATE INDEX IF NOT EXISTS deleted_records_deleted_record_id ON deleted_records (deleted_record_id);
//     `;
//
// export const createGroupsTable = `
//   CREATE TABLE IF NOT EXISTS groups (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     name TEXT,
//     is_modified INTEGER,
//     created_by TEXT
//   );
// `;
//
// export const createMealPlansTable = `
//   CREATE TABLE IF NOT EXISTS mealplans (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     date TEXT,
//     group_id TEXT,
//     recipe_id TEXT,
//     title TEXT,
//     type TEXT,
//     is_modified INTEGER,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
//     FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
//   );
//   CREATE INDEX IF NOT EXISTS mealplans_recipe_id ON mealplans (recipe_id);
// `;
//
// export const createProfileGroupsTable = `
//   CREATE TABLE IF NOT EXISTS profile_groups (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     group_id TEXT,
//     group_role TEXT,
//     profile_id TEXT,
//     is_modified INTEGER,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
//     FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
//   );
//   CREATE INDEX IF NOT EXISTS profile_groups_profile_id ON profile_groups (profile_id);
// `;
//
// export const createProfileTable = `
//   CREATE TABLE IF NOT EXISTS profile (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     name TEXT,
//     access_level TEXT,
//     is_modified INTEGER
//   )
// `;
//
// export const createRecipeCategoriesTable = `
//   CREATE TABLE IF NOT EXISTS recipe_categories (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     category_id TEXT,
//     group_id TEXT,
//     recipe_id TEXT,
//     is_modified INTEGER,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
//     FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
//     FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
//   );
//   CREATE INDEX IF NOT EXISTS recipe_categories_recipe_id ON recipe_categories (recipe_id);
// `;
//
// export const createRecipeIngredientsTable = `
//   CREATE TABLE IF NOT EXISTS recipe_ingredients (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     group_id TEXT,
//     recipe_id TEXT,
//     section_title TEXT,
//     sequence INTEGER,
//     text TEXT,
//     is_modified INTEGER,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
//     FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
//   );
//   CREATE INDEX IF NOT EXISTS recipe_ingredients_recipe_id ON recipe_ingredients (recipe_id);
// `;
// export const createRecipeInstructionsTable = `
//   CREATE TABLE IF NOT EXISTS recipe_instructions (
//     id TEXT PRIMARY KEY,
//     recipe_id TEXT,
//     created_at TEXT,
//     updated_at TEXT,
//     group_id TEXT,
//     section_title TEXT,
//     sequence INTEGER,
//     text TEXT,
//     is_modified INTEGER,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
//     FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
//   );
//   CREATE INDEX IF NOT EXISTS recipe_instructions_recipe_id ON recipe_instructions (recipe_id);
// `;
// export const createRecipesTable = `
//   CREATE TABLE IF NOT EXISTS recipes (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     user_id TEXT,
//     servings INTEGER,
//     rating INTEGER,
//     date_added TEXT,
//     last_made TEXT,
//     group_id TEXT,
//     source TEXT,
//     note TEXT,
//     name TEXT,
//     description TEXT,
//     image TEXT,
//     prep_time TEXT,
//     cook_time TEXT,
//     is_modified INTEGER,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
//   );
//   CREATE INDEX IF NOT EXISTS recipes_group_id ON recipes (group_id);
// `;
// export const createRecipeTagsTable = `
//   CREATE TABLE IF NOT EXISTS recipe_tags (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     group_id TEXT,
//     tag_id TEXT,
//     recipe_id TEXT,
//     is_modified INTEGER,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
//     FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
//     FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
//   );
//   CREATE INDEX IF NOT EXISTS recipe_tags_recipe_id ON recipe_tags (recipe_id);
// `;
//
// export const createTagsTable = `
//   CREATE TABLE IF NOT EXISTS tags (
//     id TEXT PRIMARY KEY,
//     created_at TEXT,
//     updated_at TEXT,
//     group_id TEXT,
//     name TEXT,
//     is_modified INTEGER,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
//   );
//   CREATE INDEX IF NOT EXISTS tags_group_id ON tags (group_id);
// `;
