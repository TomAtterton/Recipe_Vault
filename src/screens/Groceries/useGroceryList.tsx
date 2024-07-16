import { useCallback, useEffect, useState } from 'react';
import { createReminder, getReminders, updateReminder } from '@/utils/reminderUtils';
import { Reminder } from 'expo-calendar';
import { updateGroceryItem, updateGroceryList, useBoundStore } from '@/store';
import { showErrorMessage } from '@/utils/promptUtils';
import { useFocusEffect } from '@react-navigation/native';

const useGroceryList = () => {
  const groceryListId = useBoundStore((state) => state.groceryId);

  const data = useBoundStore((state) => state.groceryList);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = useCallback(async (shouldLoad: boolean) => {
    try {
      shouldLoad && setIsLoading(true);
      const reminderResponse = await getReminders();
      updateGroceryList(reminderResponse);
    } catch (e) {
      console.log('error', e);
    } finally {
      setTimeout(() => {
        shouldLoad && setIsLoading(false);
      }, 500);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleRefresh(true);
    }, [handleRefresh])
  );

  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);
      const reminderResponse = await getReminders();
      updateGroceryList(reminderResponse);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList, groceryListId]);

  const handleEdit = async (details: Reminder) => {
    try {
      updateGroceryItem(details);
      await updateReminder(details);
    } catch (e) {
      showErrorMessage('Error updating reminder');
      console.log('error', e);
    }
  };

  const handleAdd = async (value: string) => {
    if (value) {
      await createReminder({
        title: value,
      });
      await handleRefresh(false);
    }
  };

  const handleCompleted = async (details: Reminder) => {
    try {
      if (details.completed) {
        await updateReminder(details, true);
        await handleRefresh(false);
      }
    } catch (e) {
      // @ts-ignore
      showErrorMessage(e?.message);
    }
  };

  return {
    data,
    isLoading,
    onEdit: handleEdit,
    onAdd: handleAdd,
    onRefresh: () => handleRefresh(true),
    onCompleted: handleCompleted,
  };
};
export default useGroceryList;
