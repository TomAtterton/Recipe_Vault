import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';
import { Reminder } from 'expo-calendar';

export type GroceryListSlice = {
  groceryId?: string;
  groceryList: Reminder[];
  setGroceryId: (id: string) => void;
  updateGroceryList: (data: Reminder[]) => void;
  updateGroceryItem: (data: Reminder) => void;
};

const initialGroceryListState = {
  groceryId: undefined,
  groceryList: [],
};

export const createGroceryListSlice: StateCreator<GroceryListSlice, [], [], GroceryListSlice> = (
  set
) => {
  sliceResetFns.add(() => set(initialGroceryListState));
  return {
    ...initialGroceryListState,
    setGroceryId: (groceryId: string) => set({ groceryId }),
    updateGroceryList: (groceryList: Reminder[]) => set({ groceryList }),
    updateGroceryItem: (groceryItem: Reminder) =>
      set((state) => {
        const index = state.groceryList.findIndex((item) => item.id === groceryItem.id);
        if (index === -1) {
          return state;
        }
        const newList = [...state.groceryList];
        newList[index] = groceryItem;
        return { groceryList: newList };
      }),
  };
};
