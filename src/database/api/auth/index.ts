import { supabase } from '@/database/supabase';

export const onSignOut = async () => supabase.auth.signOut();
