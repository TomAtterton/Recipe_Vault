import { database } from '@/database';
import { SQLiteDatabase } from 'expo-sqlite/next';
import { supabase } from '@/services';

export const TABLE_NAMES = [
  'profile',
  'groups',
  'profile_groups',
  'tags',
  'categories',
  'recipes',
  'recipe_instructions',
  'recipe_categories',
  'recipe_ingredients',
  'recipe_tags',
  'mealplans',
  // 'deleted_records',
] as const;

/**
 * Pushes all modified records to the remote database
 */
export const syncPush = async () => {
  const db = database as SQLiteDatabase;
  // list all the tables in the database

  for (const tableName of TABLE_NAMES) {
    try {
      const deletedRecords = await db.getAllAsync(
        `SELECT * FROM deleted_records WHERE is_modified = 1`
      );
      if (deletedRecords.length > 0) {
        await handleDeleteRemoteTable(deletedRecords);
      }
    } catch (error) {
      console.log('Error getting deleted records', error);
    }

    const records = await db.getAllAsync(`SELECT * FROM ${tableName} WHERE is_modified = 1`);

    if (records.length > 0) {
      await handleUpdateRemoteTable(tableName, records);
    }
  }
};

const handleDeleteRemoteTable = async (records: any[]) => {
  const db = database as SQLiteDatabase;
  try {
    // We need to remove the additional property `is_modified` from the local database before we upsert the records to the remote database
    const modifiedRecords = records.map((record) => {
      delete record?.is_modified;
      return record;
    });

    for (const record of modifiedRecords) {
      const deletedRecordId = record?.deleted_record_id;

      // We add the deleted record to the remote database so other users can see that it has been deleted
      const { error: deleteRecordError } = await supabase
        .from('deleted_records')
        .upsert(modifiedRecords);

      const key = () => {
        switch (record.table_name) {
          case 'recipe_ingredients':
          case 'recipe_instructions':
          case 'recipe_categories':
          case 'recipe_tags':
            return 'recipe_id';
          default:
            return 'id';
        }
      };

      // Then we delete the record from the remote database table
      const { error: deleteTableError } = await supabase
        .from(record.table_name)
        .delete()
        .eq(key(), deletedRecordId);

      if (deleteTableError || deleteRecordError) {
        throw deleteTableError || deleteRecordError;
      }
      // Then we delete the record from the local database
      await db.runAsync(`DELETE FROM deleted_records WHERE id = ?`, [record.id]);
    }
  } catch (error) {
    console.log('Error handling delete remote table', error);
    throw error;
  }
};

const handleUpdateRemoteTable = async (tableName: string, records: any[]) => {
  const db = database as SQLiteDatabase;

  try {
    // We need to remove the additional property `is_modified` from the local database before we upsert the records to the remote database
    const modifiedRecords = records.map((record) => {
      if (record?.is_modified) {
        delete record?.is_modified;
      }
      return record;
    });
    // @ts-ignore
    const { error } = await supabase.from(tableName).upsert(modifiedRecords);

    if (error) {
      console.log('Error upserting records to remote table', error);
      throw error;
    }

    for (const record of records) {
      const { id, is_modified } = record || {};
      if (is_modified) {
        await db.runAsync(`UPDATE ${tableName} SET is_modified = 0 WHERE id = ?`, [id]);
      }
    }
  } catch (error) {
    console.log('Error handling update remote table', error);
    throw error;
  }
};
