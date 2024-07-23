export const createRecipeTagsTable = `
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
`;
