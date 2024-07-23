export const createProfileGroupsTable = `
  CREATE TABLE IF NOT EXISTS profile_groups (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    updated_at TEXT,
    group_id TEXT,
    group_role TEXT,
    profile_id TEXT,
    is_modified INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS profile_groups_profile_id ON profile_groups (profile_id);
`;
