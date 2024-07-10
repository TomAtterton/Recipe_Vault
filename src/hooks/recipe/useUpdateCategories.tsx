import { Category } from '@/types';
import useCategories from '@/database/api/categories/useCategories';
import usePostCategories from '@/database/api/categories/usePostCategories';
import useDeleteCategory from '@/database/api/categories/useDeleteCategory';
import { showErrorMessage } from '@/utils/promptUtils';

const useUpdateCategories = () => {
  const { data } = useCategories();
  const { addCategory } = usePostCategories();
  const { onDeleteCategory } = useDeleteCategory();
  //
  const onUpdateCategory = async (category: Category) => {
    try {
      category?.name && (await addCategory({ name: category.name }));
    } catch (e) {
      showErrorMessage('Error adding category');
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await onDeleteCategory({ id: category.id });
    } catch (e) {
      showErrorMessage('Error deleting category');
    }
  };

  return { data, onUpdateCategory, onDeleteCategory: handleDeleteCategory };
};

export default useUpdateCategories;
