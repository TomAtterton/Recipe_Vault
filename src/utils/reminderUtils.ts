import {
  EntityTypes,
  getCalendarsAsync,
  Reminder,
  requestRemindersPermissionsAsync,
  getRemindersAsync,
  updateReminderAsync,
  createReminderAsync,
} from 'expo-calendar';
import { useBoundStore } from '@/store';

export const requestReminderPermission = async () => {
  try {
    const { status } = await requestRemindersPermissionsAsync();

    const isGranted = status === 'granted';
    useBoundStore.getState().setHasReminderPermission(isGranted);
    return status === 'granted';
  } catch (error) {
    console.log('Error requesting reminder permission', error);
    return false;
  }
};

export const getAllReminders = async () => {
  try {
    const hasPermission = await requestReminderPermission();
    if (!hasPermission) return;

    return getCalendarsAsync(EntityTypes.REMINDER);
  } catch (error) {
    throw error;
  }
};

export const getReminders = async () => {
  try {
    const id = useBoundStore.getState().groceryId;

    if (!id) {
      throw new Error('No calendar id provided');
    }
    // @ts-ignore
    const reminders = await getRemindersAsync([id]);
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
      await updateReminderAsync(details.id, {
        calendarId: details.calendarId,
        id: details.id,
        completed: shouldComplete || false,
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
      await createReminderAsync(calendarId, details);
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
    if (!calendarId) {
      throw new Error('No calendar id provided');
    }
    await Promise.all(details.map((detail) => createReminderAsync(calendarId, detail)));
  } catch (error) {
    throw error;
  }
};
