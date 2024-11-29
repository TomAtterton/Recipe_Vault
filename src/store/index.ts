import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createProfileSlice, ProfileSlice } from '@/store/profile';
import { createWebviewSlice, WebviewSlice } from '@/store/webview';
import { createDatabaseSlice, DatabaseSlice } from '@/store/database';
import { sliceResetFns } from '@/store/helper';
import { createScanImageSlice, ScanImageSlice } from '@/store/scanimage';
import { createGroceryListSlice, GroceryListSlice } from '@/store/groceryList';
import { Reminder } from 'expo-calendar';
import { AppSlice, createAppSlice } from '@/store/app';
import { createCurrentRecipeSlice, CurrentRecipeSlice } from '@/store/currentRecipe';
import { createRecipeFormSlice, RecipeFormSlice } from '@/store/recipeForm';

export const useBoundStore = create<
  ProfileSlice &
    WebviewSlice &
    DatabaseSlice &
    ScanImageSlice &
    GroceryListSlice &
    AppSlice &
    CurrentRecipeSlice &
    RecipeFormSlice
>()(
  persist(
    (set, get, store) => ({
      ...createProfileSlice(set, get, store),
      ...createWebviewSlice(set, get, store),
      ...createDatabaseSlice(set, get, store),
      ...createScanImageSlice(set, get, store),
      ...createGroceryListSlice(set, get, store),
      ...createAppSlice(set, get, store),
      ...createCurrentRecipeSlice(set, get, store),
      ...createRecipeFormSlice(set, get, store),
    }),
    {
      name: 'bound-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        session: state.session,
        bookmarks: state.bookmarks,
        history: state.history,
        lastSynced: state.lastSynced,
        groceryId: state.groceryId,
        groceryList: state.groceryList,
        hasOnboarded: state.hasOnboarded,
        shouldSync: state.shouldSync,
        currentDatabaseName: state.currentDatabaseName,
        darkMode: state.darkMode,
        hasReminderPermission: state.hasReminderPermission,
        databases: state.databases,
        hasPremium: state.hasPremium,
        hasSeenMigrationPrompt: state.hasSeenMigrationPrompt,
      }),
    },
  ),
);
export const resetAllSlices = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
  });
};

/**
 * Global Actions
 */
export const onClearStore = () => {
  resetAllSlices();
  useBoundStore.persist.clearStorage();
  useBoundStore.persist.rehydrate();
};

export const setScannedImage = (scannedImage?: string | null) =>
  useBoundStore.getState().setScannedImage(scannedImage);

/**
 * Profile Actions
 */
export const setProfile = (data: ProfileSlice['profile']) =>
  useBoundStore.getState().setProfile(data);

export const setSession = (data: ProfileSlice['session']) =>
  useBoundStore.getState().setSession(data);

export const updateProfile = (data: Partial<ProfileSlice['profile']>) =>
  useBoundStore.getState().updateProfile(data);
export const setResetProfile = () => useBoundStore.getState().setResetProfile();

/**
 * Webview Actions
 */
export const addBookmark = ({ name, url }: { name: string; url: string }) =>
  useBoundStore.getState().setBookmark({ name, url });

export const deleteBookmark = ({ id }: { id: string }) => {
  useBoundStore.getState().deleteBookmark({ id });
};
export const onEditBookmark = ({ id, name }: { id: string; name: string }) => {
  useBoundStore.getState().onEditBookmark({ id, name });
};

export const addHistory = ({ name, url }: { name: string; url: string }) =>
  useBoundStore.getState().setHistory({ name, url });

export const deleteHistory = ({ id }: { id: string }) => {
  useBoundStore.getState().deleteHistory({ id });
};

export const deleteAllHistory = () => {
  useBoundStore.getState().deleteAllHistory();
};
/**
 * Grocery List Actions
 */
export const updateGroceryList = (list: Reminder[]) =>
  useBoundStore.getState().updateGroceryList(list);

export const updateGroceryItem = (item: Reminder) =>
  useBoundStore.getState().updateGroceryItem(item);
export const setGroceryId = (id: string) => useBoundStore.getState().setGroceryId(id);

/**
 * App Actions
 */
export const setHasOnboarded = (hasOnboarded: boolean) =>
  useBoundStore.getState().setHasOnboarded(hasOnboarded);

export const setDarkMode = (darkMode: boolean) => useBoundStore.getState().setDarkMode(darkMode);

/**
 * Database Actions
 */
export const setShouldSync = (shouldSync: boolean) =>
  useBoundStore.getState().setShouldSync(shouldSync);

export const setCurrentDatabaseName = (currentDatabaseName: string) =>
  useBoundStore.getState().setCurrentDatabaseName(currentDatabaseName);

export const setLastSynced = (lastSynced?: string) =>
  useBoundStore.getState().setLastSynced(lastSynced);

export const setResetDatabase = () => useBoundStore.getState().setResetDatabase();
