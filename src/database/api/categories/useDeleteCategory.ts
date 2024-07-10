import { deleteCategory } from '@/database/api/categories/index';

const useDeleteCategory = () => {
  const handleDeleteCategory = async ({ id }: { id: string }) => {
    try {
      await deleteCategory({ id });
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    onDeleteCategory: handleDeleteCategory,
  };
};

export default useDeleteCategory;
