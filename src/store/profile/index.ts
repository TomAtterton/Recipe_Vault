import { StateCreator } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { sliceResetFns } from '@/store/helper';
import { Env } from '@/core/env';

export type ProfileSlice = {
  //  TODO i don't need the whole session right ?
  session: Session | null;
  setSession: (session: ProfileSlice['session']) => void;
  // TODO in theory this should be a in Database
  profile: {
    id: string;
    groupId: string;
    groupName?: string;
    groupRole?: string;
    name?: string;
    email: string;
    avatarId?: string;
    access_level?: string;
  };
  setProfile: (profile: ProfileSlice['profile']) => void;
  //  TODO why do we have update
  updateProfile: (profile: Partial<ProfileSlice['profile']>) => void;
  //
  setResetProfile: () => void;
  //
  hasPremium: boolean;
  setHasPremium: (hasPremium: boolean) => void;
  //
};

const initialProfileState = {
  session: null,
  profile: {
    // Opening app for first time we always have these values
    id: Env.LOCAL_USER_ID,
    groupId: Env.LOCAL_GROUP_ID,
    groupName: Env.SQLITE_DB_NAME,
    //
    name: '',
    email: '',
    avatarId: '',
    group_role: 'read_write',
    access_level: 'free',
  },
  hasPremium: false,
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
    setHasPremium: (hasPremium) => set({ hasPremium }),
  };
};
