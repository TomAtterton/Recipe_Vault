import { useCallback, useEffect, useState } from 'react';
import {
  createReminder,
  getReminders,
  updateReminder,
  requestReminderPermission,
} from '@/utils/reminderUtils';
import { Reminder } from 'expo-calendar';
import { updateGroceryItem, updateGroceryList, useBoundStore } from '@/store';
import { showErrorMessage } from '@/utils/promptUtils';
import { useFocusEffect } from '@react-navigation/native';
import { translate } from '@/core';

const useGroceryList = () => {
  const groceryListId = useBoundStore((state) => state.groceryId);

  const data = useBoundStore((state) => state.groceryList);
  const [isLoading, setIsLoading] = useState(false);

  const hasReminderPermission = useBoundStore((state) => state.hasReminderPermission);

  const handleRefresh = useCallback(async (shouldLoad: boolean) => {
    try {
      shouldLoad && setIsLoading(true);
      const hasPermission = await requestReminderPermission(); // Ensure permission
      if (hasPermission) {
        const reminderResponse = await getReminders();
        updateGroceryList(reminderResponse);
      } else {
        showErrorMessage(translate('groceries.permission_denied'));
      }
    } catch (e) {
      console.log('Error refreshing reminders:', e);
    } finally {
      setTimeout(() => {
        shouldLoad && setIsLoading(false);
      }, 500);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleRefresh(true);
    }, [handleRefresh]),
  );

  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);
      const hasPermission = await requestReminderPermission(); // Ensure permission
      if (hasPermission) {
        const reminderResponse = await getReminders();
        updateGroceryList(reminderResponse);
      }
    } catch (e) {
      console.log('Error fetching reminders:', e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList, groceryListId]);

  const handleEdit = async (details: Reminder, shouldComplete?: boolean) => {
    try {
      updateGroceryItem(details);
      await updateReminder(details, shouldComplete);
      await handleRefresh(false);
    } catch (e) {
      showErrorMessage(translate('grocery_list.error_updating_reminder'));
      console.log('Error updating reminder:', e);
    }
  };

  const handleAdd = async (value: string) => {
    if (value) {
      try {
        const hasPermission = await requestReminderPermission(); // Ensure permission
        if (hasPermission) {
          await createReminder({ title: value });
          await handleRefresh(false);
        } else {
          showErrorMessage(translate('groceries.permission_denied'));
        }
      } catch (e) {
        console.log('Error adding reminder:', e);
      }
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
    hasDeniedPermission: !hasReminderPermission,
  };
};

export default useGroceryList;
