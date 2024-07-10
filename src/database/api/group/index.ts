import { supabase } from '@/database/supabase';
import { randomUUID } from 'expo-crypto';

export const createGroup = async ({ name, userId }: { name: string; userId?: string }) => {
  try {
    const id = randomUUID();
    const { error: groupError } = await supabase.from('groups').insert([
      {
        id,
        name,
        updated_at: new Date().toISOString(),
      },
    ]);

    const { error: profileGroupError } = await supabase.from('profile_groups').insert([
      {
        id: randomUUID(),
        profile_id: userId,
        group_id: id,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (groupError || profileGroupError) {
      throw new Error('Error creating group');
    }

    return id;
  } catch (e) {
    console.log('error creating group', e);
    throw e;
  }
};

export const createProfileGroup = async ({
  userId,
  groupId,
}: {
  userId?: string;
  groupId: string;
}) => {
  try {
    // @ts-ignore
    const { error } = await supabase.from('profile_groups').insert([
      {
        id: randomUUID(),
        profile_id: userId,
        group_id: groupId,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw error;
    }
  } catch (e) {
    console.log('error creating profile group', e);
    throw e;
  }
};
