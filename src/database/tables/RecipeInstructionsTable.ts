export const createRecipeInstructionsTable = `
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
`;
