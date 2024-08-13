import { StateCreator } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { sliceResetFns } from '@/store/helper';
import { Env } from '@/core/env';

export type ProfileSlice = {
  session: Session | null;
  profile: {
    id?: string;
    groupId: string;
    groupName?: string;
    groupRole?: string;
    name?: string;
    email: string;
    avatarId?: string;
  };
  setProfile: (profile: ProfileSlice['profile']) => void;
  updateProfile: (profile: Partial<ProfileSlice['profile']>) => void;
  setSession: (session: ProfileSlice['session']) => void;
  setResetProfile: () => void;
};

const initialProfileState = {
  session: null,
  profile: {
    id: Env.TEST_USER_ID,
    cloudId: '',
    name: '',
    email: '',
    avatarId: '',
    group_role: 'read_write',
    groupId: Env.TEST_GROUP_ID,
    groupName: Env.SQLITE_DB_NAME,
  },
};

export const createProfileSlice: StateCreator<ProfileSlice, [], [], ProfileSlice> = (set) => {
  sliceResetFns.add(() => set(initialProfileState));
  return {
    ...initialProfileState,
    setProfile: async (profile) => set({ profile }),
    updateProfile: async (profile) =>
      set((state) => ({ profile: { ...state.profile, ...profile } })),
    setSession: (session) => set({ session }),
    setResetProfile: () => set(initialProfileState),
  };
};
