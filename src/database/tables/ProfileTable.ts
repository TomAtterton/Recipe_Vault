export const createProfileTable = `
  CREATE TABLE IF NOT EXISTS profile (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    name TEXT,
    is_modified INTEGER
  )
`;
