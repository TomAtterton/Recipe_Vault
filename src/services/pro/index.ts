import { supabase } from '@/services';
import { useBoundStore } from '@/store';
import { getRecipeCount } from '@/database/api/recipes';

/**
 * Check if user has premium to access features like AI
 */
export const checkIfPremium = async () => {
  const userId = useBoundStore.getState().session?.user.id;
  if (!userId) {
    return false;
  }

  const { data, error } = await supabase.from('profile').select('access_level').eq('id', userId);

  if (error) {
    throw new Error('Error fetching profile');
  }

  const accessLevel = data?.[0]?.access_level;

  return accessLevel === 'premium';
};

/**
 * Check if user has pro vault
 */

export const checkIfPro = async () => {
  try {
    const groupId = useBoundStore.getState().profile.groupId;

    const { data: pro_vaults, error } = await supabase
      .from('pro_vaults')
      .select('*')
      .eq('group_id', groupId || '');

    if (error) {
      throw new Error('Error fetching pro vaults');
    }

    if (pro_vaults && pro_vaults?.length > 0) {
      useBoundStore.getState().setDatabaseStatus('pro');
      return true;
    } else {
      useBoundStore.getState().setDatabaseStatus('free');
      return false;
    }
  } catch (error) {
    // swallow error
    console.log('Error checking if user is pro', error);
    return false;
  }
};

export const checkCanAddRecipe = async () => {
  try {
    const isPro = checkIfPro();
    const recipeCount = await getRecipeCount();
    return recipeCount < 5 || isPro;
  } catch (error) {
    console.log('Error checking if user can add recipe', error);
    throw new Error('Cloud sync is enabled and you have reached the maximum recipe limit.');
  }
};
