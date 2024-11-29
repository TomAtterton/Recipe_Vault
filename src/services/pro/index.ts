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

export const checkCanAddRecipe = async () => {
  try {
    const hasPremium = useBoundStore.getState().hasPremium;
    const recipeCount = await getRecipeCount();
    return recipeCount < 5 || hasPremium;
  } catch (error) {
    console.log('Error checking if user can add recipe', error);
    throw new Error('Cloud sync is enabled and you have reached the maximum recipe limit.');
  }
};
