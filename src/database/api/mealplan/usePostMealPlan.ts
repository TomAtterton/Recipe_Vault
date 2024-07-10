import { useBoundStore } from '@/store';
import { insertMealplan } from '@/database/api/mealplan/index';

const usePostMealPlan = () => {
  const groupId = useBoundStore((state) => state.profile.groupId);

  const addMealPlan = async ({
    title,
    entryType,
    date,
    recipeId,
  }: {
    title: string;
    entryType: string;
    date: string;
    recipeId: string;
  }) => {
    try {
      await insertMealplan({
        title,
        type: entryType,
        date,
        group_id: groupId,
        recipe_id: recipeId,
      });
    } catch (error) {
      console.log('Add mealplan error', error);
      throw error;
    }
  };

  return {
    addMealPlan,
  };
};

export default usePostMealPlan;
