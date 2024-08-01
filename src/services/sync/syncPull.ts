import { supabase } from '@/services';
import { database } from '@/database';
import { SQLiteDatabase } from 'expo-sqlite/next';
import { useBoundStore } from '@/store';
import { syncDelete } from '@/services/sync/syncDelete';
import { showErrorMessage } from '@/utils/promptUtils';

export const TABLE_NAMES = [
  'profile',
  'groups',
  'profile_groups',
  'categories',
  'tags',
  'recipes',
  'recipe_instructions',
  'recipe_categories',
  'recipe_tags',
  'recipe_ingredients',
  'mealplans',
  'deleted_records',
] as const;

type TableName = (typeof TABLE_NAMES)[number];

interface GenericRecord {
  id: string;

  [key: string]: any; // Add specific properties for your records here
}

// We use an old timestamp here to make sure you fetch all data on the first sync
const oldTimestamp = '2021-01-01T00:00:00.000Z';

/**
 * Pulls all changes from the remote database and updates the local database
 */
export const syncPull = async (forceAll?: boolean): Promise<void> => {
  try {
    const lastSynced = forceAll
      ? oldTimestamp
      : useBoundStore.getState()?.lastSynced || oldTimestamp;

    const changes: GenericRecord[][] = await Promise.all(
      TABLE_NAMES.map((tableName) => fetchChanges(tableName, lastSynced))
    );

    for (let i = 0; i < TABLE_NAMES.length; i++) {
      const tableName = TABLE_NAMES[i];
      const tableChanges = changes[i];

      if (tableChanges && tableChanges.length > 0) {
        await updateLocalTable(tableName, tableChanges);
      }
    }

    await syncDelete(lastSynced);

    useBoundStore.getState()?.setLastSynced(new Date().toISOString());
  } catch (e) {
    console.error('syncPull error', e);
    // @ts-ignore
    showErrorMessage('Error pull syncing data', e.message);
    throw e;
  }
};

const updateLocalTable = async (tableName: TableName, records: GenericRecord[]): Promise<void> => {
  const db = database as SQLiteDatabase;

  try {
    for (const record of records) {
      const existingRecord = await db.getFirstAsync(`SELECT id FROM ${tableName} WHERE id = ?`, [
        record.id,
      ]);

      if (existingRecord) {
        const columns = Object.keys(record)
          .map((key) => `${key} = ?`)
          .join(', ');

        await db.runAsync(`UPDATE ${tableName} SET ${columns} WHERE id = ?`, [
          ...Object.values(record),
          record.id,
        ]);
      } else {
        const columns = Object.keys(record).join(', ');
        const placeholders = new Array(Object.keys(record).length).fill('?').join(', ');
        await db.runAsync(
          `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
          Object.values(record)
        );
      }
    }
  } catch (e) {
    console.error('update local table error', e);
  }
};

const fetchChanges = async (
  tableName: TableName,
  last_updated_at: string
): Promise<GenericRecord[]> => {
  const groupId = useBoundStore.getState()?.profile?.groupId || '';
  const profileId = useBoundStore.getState()?.profile?.id || '';

  switch (tableName) {
    case 'profile':
      const profile = await supabase
        .from(tableName)
        .select('*')
        .gte('updated_at', last_updated_at)
        .eq('id', profileId);
      return profile.data as any[];
    case 'groups':
      const groups = await supabase
        .from(tableName)
        .select('*')
        .gte('updated_at', last_updated_at)
        .eq('id', groupId);
      return groups.data as any[];
    case 'profile_groups':
      const profileGroups = await supabase
        .from(tableName)
        .select('*')
        .gte('updated_at', last_updated_at)
        .eq('profile_id', profileId);
      return profileGroups.data as any[];
    case 'categories':
    case 'tags':
    case 'mealplans':
    //
    case 'recipes':
    case 'recipe_instructions':
    case 'recipe_categories':
    case 'recipe_tags':
    case 'recipe_ingredients':
    default:
      const response = await supabase
        .from(tableName)
        .select('*')
        .gte('updated_at', last_updated_at)
        .eq('group_id', groupId);
      return (response.data as any[]) || [];
  }
};
