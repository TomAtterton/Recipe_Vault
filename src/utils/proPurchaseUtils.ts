import { supabase } from '@/database/supabase';
import { useBoundStore } from '@/store';
import { getRecipeCount } from '@/database/api/recipes';

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
  }
};

export const checkCanAddRecipe = async () => {
  try {
    const isPro = checkIfPro();
    const recipeCount = await getRecipeCount();

    return isPro || recipeCount < 5;
  } catch (error) {
    throw new Error('Cloud sync is enabled and you have reached the maximum recipe limit.');
  }
};
