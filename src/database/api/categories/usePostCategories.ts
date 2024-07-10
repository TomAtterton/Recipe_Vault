import { useBoundStore } from '@/store';
import { insertCategory } from '@/database/api/categories/index';

const usePostCategories = () => {
  const groupId = useBoundStore((state) => state.profile.groupId);

  const addCategory = async ({ name }: { name: string }) => {
    try {
      await insertCategory({ name, groupId });
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    addCategory,
  };
};

export default usePostCategories;
