import { database } from '@/database';
import { supabase } from '@/services';

export const TABLE_NAMES = [
  'profile',
  'groups',
  'profile_groups',
  'tags',
  'categories',
  'recipes',
  'recipe_instructions',
  'recipe_ingredients',
  'recipe_categories',
  'recipe_tags',
  'mealplans',
] as const;

interface GenericRecord {
  id: string;

  [key: string]: any; // Add specific properties for your records here
}

/**
 * Pushes all modified records to the remote database
 */
export const syncPush = async () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  for (const tableName of TABLE_NAMES) {
    const records: GenericRecord[] = await database.getAllAsync(
      `SELECT * FROM ${tableName} WHERE is_modified IS NOT NULL AND is_modified = 1`,
    );

    if (records && records.length > 0) {
      await handleUpdateRemoteTable(tableName, records);
    }
  }
};

const handleUpdateRemoteTable = async (tableName: string, records: GenericRecord[]) => {
  if (!database) {
    throw new Error('Database not initialized');
  }

  try {
    // Clone records to avoid modifying the original array
    const modifiedRecords = records.map((record) => {
      const clonedRecord = { ...record };
      if (clonedRecord.is_modified) {
        delete clonedRecord.is_modified;
      }
      return clonedRecord;
    });

    // @ts-ignore
    const { error } = await supabase.from(tableName).upsert(modifiedRecords);

    if (error) {
      console.error('Error upserting records to remote table:', error);
      throw error;
    }

    // Use a transaction to update multiple records at once
    await database.withExclusiveTransactionAsync(async (tx) => {
      for (const record of records) {
        const { id, is_modified } = record || {};
        if (is_modified) {
          await tx.runAsync(`UPDATE ${tableName} SET is_modified = 0 WHERE id = ?`, [id]);
        }
      }
    });
  } catch (error) {
    console.error('Error handling update remote table:', error);
    throw error;
  }
};
