import { useBoundStore } from '@/store';
import { database } from '@/database';
import { SQLiteDatabase } from 'expo-sqlite/next';
import { supabase } from '@/services';
const oldTimestamp = '2021-01-01T00:00:00.000Z';

export const syncDelete = async (lastSynced?: string): Promise<void> => {
  const last_updated_at = lastSynced
    ? lastSynced
    : useBoundStore.getState()?.lastSynced || oldTimestamp;

  const groupId = useBoundStore.getState()?.profile?.groupId || '';

  try {
    const { data, error } = await supabase
      .from('deleted_records')
      .select('table_name, deleted_record_id')
      .gte('created_at', last_updated_at)
      .eq('group_id', groupId);

    if (error) {
      console.error('delete local table error', error);
      throw error;
    }

    const db = database as SQLiteDatabase;

    for (const record of data) {
      await db.runAsync(`DELETE FROM ${record.table_name} WHERE id = ?`, [
        record.deleted_record_id,
      ]);
    }
  } catch (e) {
    console.error('delete local table error', e);
    throw e;
  }
};
