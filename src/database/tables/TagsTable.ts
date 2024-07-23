export const createTagsTable = `
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
`;
