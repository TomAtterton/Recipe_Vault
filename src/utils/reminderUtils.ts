import * as Calendar from 'expo-calendar';
import { Reminder } from 'expo-calendar';
import { useBoundStore } from '@/store';
import { Alert } from 'react-native';

export const requestReminderPermission = async () => {
  try {
    const { status, canAskAgain } = await Calendar.requestRemindersPermissionsAsync();

    if (status === 'denied' && !canAskAgain) {
      Alert.alert('Permission Denied', 'You need to enable reminder permissions in settings');
    }

    return status === 'granted';
  } catch (error) {
    return false;
  }
};

export const getAllReminders = async () => {
  try {
    const hasPermission = requestReminderPermission();

    if (!hasPermission) {
      return;
    }
    const response = await Calendar.getCalendarsAsync(Calendar.EntityTypes.REMINDER);
    return response;
  } catch (error) {
    console.log('ERROR', error);
  }
};

export const getReminders = async () => {
  try {
    const id = useBoundStore.getState().groceryId;

    if (!id) {
      throw new Error('No calendar id provided');
    }
    // @ts-ignore
    const reminders = await Calendar.getRemindersAsync([id]);
    return reminders.filter((reminder) => reminder.completed === false);
  } catch (error) {
    // @ts-ignore
    if (error?.code === 'ERR_MISSION_PERMISSIONS') {
      requestReminderPermission();
    }

    throw error;
  }
};

export const updateReminder = async (details: Reminder, shouldComplete?: boolean) => {
  try {
    if (details?.id) {
      await Calendar.updateReminderAsync(details.id, {
        calendarId: details.calendarId,
        id: details.id,
        completed: shouldComplete,
        completionDate: new Date(),
        title: details.title,
      });
    } else {
      throw new Error('No reminder id provided');
    }
  } catch (error) {
    throw error;
  }
};

export const createReminder = async (details: Reminder) => {
  try {
    const calendarId = useBoundStore.getState().groceryId;
    if (calendarId) {
      await Calendar.createReminderAsync(calendarId, details);
    } else {
      throw new Error('No calendar id provided');
    }
  } catch (error) {
    throw error;
  }
};

export const createMultipleReminders = async (details: Reminder[]) => {
  try {
    const calendarId = useBoundStore.getState().groceryId;
    if (calendarId) {
      for (let i = 0; i < details.length; i++) {
        await Calendar.createReminderAsync(calendarId, details[i]);
      }
    } else {
      throw new Error('No calendar id provided');
    }
  } catch (error) {
    throw error;
  }
};
