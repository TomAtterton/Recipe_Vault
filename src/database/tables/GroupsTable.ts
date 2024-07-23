export const createGroupsTable = `
  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    name TEXT,
    is_modified INTEGER
  );
`;
