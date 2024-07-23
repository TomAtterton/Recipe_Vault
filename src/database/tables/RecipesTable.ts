export const createRecipesTable = `
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
`;
