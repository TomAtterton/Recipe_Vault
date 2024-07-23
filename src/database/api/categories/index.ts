import { TableNames } from '@/database/api/types';
import { randomUUID } from 'expo-crypto';
import { sqlDelete, sqlExecute, sqlInsert } from '@/database/sql';

export const SELECT_CATEGORIES = `SELECT id, name FROM ${TableNames.categories}`;

export const deleteCategory = async ({ id }: { id: string }) =>
  sqlDelete(TableNames.categories, id);

export const updateCategory = async ({ id, name }: { id: string; name: string }) =>
  sqlExecute(`UPDATE categories SET name = ? WHERE id = ?`, [name, id]);

export const insertCategory = async ({ name, groupId }: { name: string; groupId: string }) =>
  sqlInsert(TableNames.categories, { id: randomUUID(), name, group_id: groupId });
