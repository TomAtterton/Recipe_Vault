export const createRecipeCategoriesTable = `
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
`;
