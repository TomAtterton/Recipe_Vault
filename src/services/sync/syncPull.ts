import { supabase } from '@/services';
import { database } from '@/database';
import { useBoundStore } from '@/store';
import { syncDelete } from '@/services/sync/syncDelete';
import { showErrorMessage } from '@/utils/promptUtils';
import { getLastSynced } from '@/services/sync/utils';
import { translate } from '@/core';

export const TABLE_NAMES = [
  'profile',
  'groups',
  'profile_groups',
  //
  'categories',
  'tags',
  //
  'recipes',
  'recipe_instructions',
  'recipe_ingredients',
  //
  'recipe_categories',
  'recipe_tags',
  //
  'mealplans',
  'deleted_records',
] as const;

type TableName = (typeof TABLE_NAMES)[number];

interface GenericRecord {
  id: string;

  [key: string]: any;
}

/**
 * Pulls all changes from the remote database and updates the local database
 */
export const syncPull = async (forceAll?: boolean): Promise<void> => {
  try {
    const lastSynced = getLastSynced(forceAll);

    await database?.withExclusiveTransactionAsync(async () => {
      // Update local tables with changes
      for (const tableName of TABLE_NAMES) {
        const tableChanges = await fetchChanges(tableName, lastSynced);
        if (tableChanges?.length) {
          await updateLocalTable(tableName, tableChanges);
        }
      }
    });

    // Handle deletions and update the sync timestamp
    await syncDelete(lastSynced);
    useBoundStore.getState()?.setLastSynced(new Date().toISOString());
  } catch (error) {
    console.error('syncPull error', error);
    showErrorMessage(translate('sync.error_pull_sync'));
    throw error;
  }
};

const updateLocalTable = async (tableName: TableName, records: GenericRecord[]): Promise<void> => {
  if (!database) {
    throw new Error('Database not initialized');
  }

  try {
    for (const record of records) {
      const existingRecord = await database.getFirstAsync(
        `SELECT id FROM ${tableName} WHERE id = ?`,
        [record.id],
      );

      const columns = Object.keys(record);
      const placeholders = columns.map(() => '?').join(', ');
      // console.log('tableName', tableName);
      // console.log('records', records);
      if (existingRecord) {
        const updateSet = columns.map((col) => `${col} = ?`).join(', ');
        await database.runAsync(`UPDATE ${tableName} SET ${updateSet} WHERE id = ?`, [
          ...Object.values(record),
          record.id,
        ]);
      } else {
        await database.runAsync(
          `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
          Object.values(record),
        );
      }
    }
  } catch (e) {
    console.error('Pulling Error updating local table:', e);
    // console.log('tableName', tableName);
    // console.log('records', records);
    // console.log('error', e?.message);
  }
};

const fetchChanges = async (
  tableName: TableName,
  last_updated_at: string,
): Promise<GenericRecord[]> => {
  const { groupId = '', id: profileId = '' } = useBoundStore.getState()?.profile || {};

  const query = supabase.from(tableName).select('*');

  switch (tableName) {
    case 'profile':
      query.eq('id', profileId);
      break;
    case 'groups':
      query.eq('id', groupId);
      break;
    case 'profile_groups':
      query.eq('profile_id', profileId);
      query.eq('group_id', groupId);
      break;
    default:
      query.eq('group_id', groupId).gt('updated_at', last_updated_at);
      break;
  }

  const response = await query;

  return response.data || [];
};
