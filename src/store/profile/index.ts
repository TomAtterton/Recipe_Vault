import { StateCreator } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { sliceResetFns } from '@/store/helper';

export type ProfileSlice = {
  session: Session | null;
  profile: {
    id?: string;
    name?: string;
    groupId: string;
    groupName?: string;
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
    id: '',
    name: '',
    email: '',
    avatarId: '',
    groupId: 'initial-group',
    groupName: 'Local Vault',
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
