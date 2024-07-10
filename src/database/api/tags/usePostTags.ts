import { useBoundStore } from '@/store';
import { insertTags } from '@/database/api/tags/index';

const usePostTags = () => {
  const groupId = useBoundStore((state) => state.profile.groupId);
  const handleAddTags = async ({ name }: { name: string }) => {
    try {
      await insertTags({ name, groupId });
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    onAddTags: handleAddTags,
  };
};

export default usePostTags;
