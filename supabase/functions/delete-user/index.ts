import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.5';
import { corsHeaders } from '../shared/cors.ts';

Deno.serve(async (req: Request) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    const {
      error: user_error,
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (user_error) throw new Error('There was an issue getting the user data');

    await deleteUserGroups(user.id, supabaseClient);

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { error: deletion_error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deletion_error) throw new Error('Something went wrong deleting the user');

    return new Response();
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'Something went wrong' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

async function deleteUserGroups(userId: string, supabaseClient: typeof createClient) {
  const { data: userGroups, error: userGroupsError } = await supabaseClient
    .from('profile_groups')
    .select('group_id')
    .eq('profile_id', userId);

  if (userGroupsError) {
    throw new Error('Failed to fetch user groups');
  }

  for (const userGroup of userGroups) {
    const { count, error: countError } = await supabaseClient
      .from('profile_groups')
      .select('profile_id', { count: 'exact' })
      .eq('group_id', userGroup.group_id);

    if (countError) {
      console.log(`Failed to count users in group ${userGroup.group_id}:`, countError.message);
      continue;
    }

    if (count == 1) {
      const { error: deleteError } = await supabaseClient
        .from('groups')
        .delete()
        .eq('id', userGroup.group_id);

      if (deleteError) {
        console.log(`Failed to delete group ${userGroup.group_id}:`, deleteError.message);
      }
    }
  }
}
