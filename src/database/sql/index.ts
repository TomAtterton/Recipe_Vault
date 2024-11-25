import { useBoundStore } from '@/store';
import { randomUUID } from 'expo-crypto';
import { SQLiteBindParams } from 'expo-sqlite';
import { database } from '@/database';

export const sqlExecute = async (sql: string, parameters?: any[]): Promise<any> => {
  if (!database) throw new Error('Database not initialized');
  try {
    console.log('SQL Execute', sql, parameters);
    return database.runAsync(sql, parameters || []);
  } catch (e) {
    console.log('error executing', e);
    throw e;
  }
};

export const sqlDelete = async (table: string, id: string, key?: string) => {
  if (!database) throw new Error('Database not initialized');
  try {
    await database.runAsync(`delete from ${table} where ${key || 'id'} = ?`, [id]);

    const currentTimestamp = new Date().toISOString();
    const groupId = useBoundStore.getState().profile.groupId;

    await sqlInsert('deleted_records', {
      id: randomUUID(),
      created_at: currentTimestamp,
      updated_at: currentTimestamp,
      deleted_record_id: id,
      table_name: table,
      group_id: groupId,
      is_modified: true,
    });
    console.log('successfully deleted', table, id);
  } catch (e) {
    console.log('error inserting', e);
    throw e;
  }
};

export const sqlInsert = async (table: string, values: Record<string, any>) => {
  if (!database) throw new Error('Database not initialized');
  try {
    const currentTimestamp = new Date().toISOString();

    const mutatedObject = {
      ...values,
      created_at: currentTimestamp,
      updated_at: currentTimestamp,
      is_modified: true,
    };

    const { columns, placeholders, parameters } = generateKeysAndPlaceholders(mutatedObject);

    await database.runAsync(
      `insert into ${table} (${columns}) values (${placeholders})`,
      parameters,
    );
  } catch (e) {
    console.log('error inserting', e);
    throw e;
  }
};

export const sqlUpdate = async (table: string, values: Record<string, any>, id: string) => {
  if (!database) throw new Error('Database not initialized');
  try {
    const mutatedObject = {
      updated_at: new Date().toISOString(),
      is_modified: true,
      ...values,
    };

    const { columns, parameters } = generateKeysAndPlaceholdersForUpdate(mutatedObject);

    await database.runAsync(`UPDATE ${table} SET ${columns} where id = ?`, [...parameters, id]);
  } catch (e) {
    throw e;
  }
};

export const sqlGet = <T>(sql: string, parameters: SQLiteBindParams): T | null => {
  if (!database) throw new Error('Database not initialized');
  return database.getFirstSync(sql, parameters);
};

const generateKeysAndPlaceholders = (values: Record<string, any>) => {
  const keys = Object.keys(values);
  const columns = keys.join(', ');
  const placeholders = keys.map(() => '?').join(', ');
  const parameters = Object.values(values);
  return { columns, placeholders, parameters };
};

const generateKeysAndPlaceholdersForUpdate = (values: Record<string, any>) => {
  const keys = Object.keys(values);
  const columns = keys.join(' = ?, ') + ' = ?';
  const parameters = Object.values(values);
  return { columns, parameters };
};
