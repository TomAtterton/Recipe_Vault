import { TableNames } from '@/database/api/types';
import { sqlDelete, sqlInsert } from '@/database';
import { randomUUID } from 'expo-crypto';

export const SELECT_TAGS = `SELECT id, name FROM ${TableNames.tags}`;
export const deleteTags = async ({ id }: { id: string }) => sqlDelete(TableNames.tags, id);

export const insertTags = async ({ name, groupId }: { name: string; groupId: string }) =>
  sqlInsert(TableNames.tags, { id: randomUUID(), name, group_id: groupId });
