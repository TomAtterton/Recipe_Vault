export const createDeletedRecordsTable = `
    CREATE TABLE IF NOT EXISTS deleted_records (
      id TEXT PRIMARY KEY,
      created_at TEXT,
      updated_at TEXT,
      deleted_record_id TEXT,
      table_name TEXT,
      group_id TEXT,
      is_modified INTEGER,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS deleted_records_deleted_record_id ON deleted_records (deleted_record_id);
    `;
