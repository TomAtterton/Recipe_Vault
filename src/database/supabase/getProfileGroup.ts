import { supabase } from '@/database/supabase/index';

export const getProfileGroup = async ({ userId }: { userId?: string | null }) => {
  try {
    const { data: profileData, error } = await supabase
      .from('profile_groups')
      .select('id, group_id, groups(name)')
      .eq('profile_id', userId || '');

    const response = profileData?.[0];
    const groupId = response?.group_id;
    const groupName = response?.groups?.name;

    return {
      groupId,
      groupName,
    };
  } catch (e) {
    console.log('Error getting group data', e);
    return {};
  }
};

export const getProfileGroupByGroupId = async ({ groupId }: { groupId: string }) => {
  try {
    const { data: groupData } = await supabase.from('groups').select('name').eq('id', groupId);

    const response = groupData?.[0];
    const groupName = response?.name;

    return {
      groupName,
    };
  } catch (e) {
    console.log('Error getting group data', e);
    return {};
  }
};
