import { deleteMealplans } from '@/database/api/mealplan/index';

const useDeleteMealPlan = () => {
  const onDeleteMealPlan = async ({ id }: { id: string }) => {
    try {
      await deleteMealplans({ id });
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    onDeleteMealPlan,
  };
};

export default useDeleteMealPlan;
