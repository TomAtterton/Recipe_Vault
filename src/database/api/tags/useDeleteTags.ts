import { deleteTags } from '@/database/api/tags/index';

const useDeleteTags = () => {
  const handleDeleteTags = async ({ id }: { id: string }) => {
    try {
      await deleteTags({ id });
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    onDeleteTags: handleDeleteTags,
  };
};

export default useDeleteTags;
