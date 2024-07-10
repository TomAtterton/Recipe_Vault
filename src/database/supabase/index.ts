import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { Env } from '@/core/env';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};
// @ts-ignore
const supabaseClient = createClient<Database>(Env.SUPABASE_URL, Env.SUPABASE_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const supabase = supabaseClient;
