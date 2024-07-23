export const createRecipeIngredientsTable = `
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
`;
