import { Category } from '@/types';
import useCategories from '@/database/api/categories/useCategories';
import usePostCategories from '@/database/api/categories/usePostCategories';
import useDeleteCategory from '@/database/api/categories/useDeleteCategory';
import { showErrorMessage } from '@/utils/promptUtils';
import { translate } from '@/core';

const useUpdateCategories = () => {
  const { data } = useCategories();
  const { addCategory } = usePostCategories();
  const { onDeleteCategory } = useDeleteCategory();

  const onUpdateCategory = async (category: Category) => {
    try {
      category?.name && (await addCategory({ name: category.name }));
    } catch (e) {
      showErrorMessage(translate('categories.error_adding'));
      console.log(translate('categories.error_adding'), e);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await onDeleteCategory({ id: category.id });
    } catch (e) {
      showErrorMessage(translate('categories.error_deleting'));
      console.log(translate('categories.error_deleting'), e);
    }
  };

  return { data, onUpdateCategory, onDeleteCategory: handleDeleteCategory };
};

export default useUpdateCategories;
