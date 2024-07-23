export const createMealPlansTable = `
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
`;
