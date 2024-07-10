import { sqlInsert } from '@/database';
import { TableNames } from '@/database/api/types';
import { randomUUID } from 'expo-crypto';

export const SELECT_PROFILE = `SELECT 
    profile.id AS profile_id, 
    profile_groups.group_id, 
    groups.name AS group_name
FROM profile  
JOIN 
    profile_groups ON profile.id = profile_groups.profile_id 
JOIN 
    groups ON profile_groups.group_id = groups.id 
WHERE 
    profile.id = ?;
`;

export const insertProfile = async ({ userId, groupId }: { userId: string; groupId: string }) =>
  sqlInsert(TableNames.profile, { id: randomUUID(), profile_id: userId, group_id: groupId });
