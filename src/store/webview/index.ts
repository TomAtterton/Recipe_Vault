import { StateCreator } from 'zustand';
import { randomUUID } from 'expo-crypto';
import { sliceResetFns } from '@/store/helper';

export type WebviewSlice = {
  history: {
    id: string;
    name: string;
    url: string;
  }[];
  setHistory: ({ name, url }: { name: string; url: string }) => void;
  deleteHistory: ({ id }: { id: string }) => void;
  deleteAllHistory: () => void;
  bookmarks: {
    id: string;
    url: string;
    name: string;
  }[];
  setBookmark: ({ name, url }: { name: string; url: string }) => void;
  onEditBookmark: ({ id, name }: { id: string; name: string }) => void;
  deleteBookmark: ({ id }: { id: string }) => void;
};

const initialWebviewState = {
  bookmarks: [],
  history: [],
};

export const createWebviewSlice: StateCreator<WebviewSlice, [], [], WebviewSlice> = (
  set,
  getState
) => {
  sliceResetFns.add(() => set(initialWebviewState));

  return {
    ...initialWebviewState,
    setHistory: ({ name, url }: { name: string; url: string }) =>
      set((state) => {
        const currentHistory = [...state.history];

        if (currentHistory.length > 100) {
          currentHistory.pop();
        }

        return {
          history: [
            {
              id: randomUUID(),
              name,
              url,
            },
            ...currentHistory,
          ],
        };
      }),
    deleteHistory: ({ id }: { id: string }) => {
      const { history } = getState();
      const newHistory = history.filter((_) => _.id !== id);
      set({ history: newHistory });
    },
    deleteAllHistory: () => {
      set({ history: [] });
    },
    onEditBookmark: ({ id, name }: { id: string; name: string }) => {
      const { bookmarks } = getState();
      const newBookmarks = bookmarks.map((_) => {
        if (_.id === id) {
          return {
            ..._,
            name,
          };
        }
        return _;
      });
      set({ bookmarks: newBookmarks });
    },

    setBookmark: async ({ name, url }: { name: string; url: string }) =>
      set((state) => ({
        bookmarks: [
          ...state.bookmarks,
          {
            id: randomUUID(),
            name,
            url,
          },
        ],
      })),
    deleteBookmark: ({ id }: { id: string }) => {
      const { bookmarks } = getState();
      const newBookmarks = bookmarks.filter((_) => _.id !== id);
      set({ bookmarks: newBookmarks });
    },
  };
};
