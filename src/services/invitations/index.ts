import { supabase } from '@/services';
import * as Crypto from 'expo-crypto';

export const generateInvitationCode = async (): Promise<string> => {
  const randomUUID = await Crypto.getRandomBytesAsync(16);
  return [...randomUUID].map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const getRedeemableInvitation = async ({ groupId }: { groupId: string }) => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id, group_id, invitation_code')
      .eq('group_id', groupId)
      .limit(1);

    if (error) {
      console.error('Error fetching redeemable invitation', error);
      throw error;
    }

    if (data && data.length > 0) {
      const invitation = data[0];
      return invitation.invitation_code;
    }

    return null; // No redeemable invitation found
  } catch (error) {
    console.error('Error fetching redeemable invitation', error);
    throw error;
  }
};
export const generateInvitation = async ({ groupId, name }: { groupId: string; name: string }) => {
  try {
    const oldInvitationCode = await getRedeemableInvitation({ groupId });

    if (oldInvitationCode) {
      return oldInvitationCode;
    }
    const invitationCode = await generateInvitationCode();

    const { error } = await supabase.from('invitations').insert([
      {
        group_id: groupId,
        invitation_code: invitationCode,
        name,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.log('Error generating invitation', error);
      throw error;
    }

    return invitationCode;
  } catch (error) {
    throw error;
  }
};

export const getGroupIdFromInvitation = async ({ invitationCode }: { invitationCode: string }) => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('group_id, name')
      .eq('invitation_code', invitationCode)
      .limit(1);
    if (error) {
      console.error('Error fetching group ID from invitation', error);
      throw error;
    }
    if (data && data.length > 0) {
      const groupData = data[0];
      // @ts-ignore
      if (!groupData?.group_id) {
        throw new Error('Group ID not found in invitation');
      }
      // @ts-ignore
      return { groupId: groupData.group_id, name: groupData.name };
    }

    return null;
  } catch (error) {
    console.error('Error fetching group ID from invitation', error);
    throw error;
  }
};
