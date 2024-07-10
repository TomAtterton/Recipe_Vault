import { deleteRecipe } from '@/database/api/recipes';

const useDeleteRecipeSupabase = () => {
  const handleDeleteRecipe = async ({ id }: { id: string }) => {
    try {
      await deleteRecipe({ id });
    } catch (error) {
      console.log('Error deleting recipe', error);
      throw error;
    }
  };

  return {
    deleteRecipe: handleDeleteRecipe,
  };
};

export default useDeleteRecipeSupabase;
