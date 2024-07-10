import { Tag } from '@/types';
import useGetTags from '@/database/api/tags/useGetTags';
import usePostTags from '@/database/api/tags/usePostTags';
import useDeleteTags from '@/database/api/tags/useDeleteTags';
import { showErrorMessage } from '@/utils/promptUtils';

const useUpdateTags = () => {
  const { data } = useGetTags();
  const { onAddTags } = usePostTags();
  const { onDeleteTags } = useDeleteTags();

  const handleUpdateTags = async (tag: Tag) => {
    try {
      tag?.name && (await onAddTags({ name: tag.name }));
    } catch (e) {
      showErrorMessage('Error adding category');
    }
  };

  const handleDeleteTags = async (tag: Tag) => {
    try {
      await onDeleteTags({ id: tag.id });
    } catch (e) {
      showErrorMessage('Error deleting category');
    }
  };

  return { data, onUpdateTags: handleUpdateTags, onDeleteTags: handleDeleteTags };
};

export default useUpdateTags;
