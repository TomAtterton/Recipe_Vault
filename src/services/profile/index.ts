import { supabase } from '@/services';
import { useBoundStore } from '@/store';
import { getUserId } from '@/hooks/common/useUserId';

type ProfileData = {
  name: string;
};

export const updateProfile = async ({ data }: { data: ProfileData }) => {
  try {
    const userId = getUserId();

    if (!userId) {
      throw new Error('User not found');
    }

    const { error } = await supabase
      .from('profile')
      .update({
        name: data?.name,
      })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    const updateProfileLocalState = useBoundStore.getState().updateProfile;

    updateProfileLocalState(data);
  } catch (e) {
    console.log('error updating profile', e);
    throw e;
  }
};
