import { ActivityIndicator, useWindowDimensions, View } from 'react-native';
import { updateProfile, useBoundStore } from '@/store';
import { Routes } from '@/navigation/Routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showErrorMessage } from '@/utils/promptUtils';
import Typography from '@/components/Typography';
import React, { useEffect, useState } from 'react';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './joinVault.style';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import FormInput from '@/components/inputs/FormInput';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import { onGetGroupName } from '@/services/group';
import { setupDatabase } from '@/utils/databaseUtils';
import NavBarButton from '@/components/buttons/NavBarButton';
import useUserId from '@/hooks/common/useUserId';
import { createProfileGroup } from '@/services/profileGroup';
import ChefShare from '../../../assets/svgs/chef_share.svg';
import { translate } from '@/core';
import { RouteProp } from '@/navigation/types';
import { getGroupIdFromInvitation } from '@/services/invitations';

const JoinVault = () => {
  const userId = useUserId();
  const { reset, goBack } = useNavigation();
  const route = useRoute<RouteProp<Routes.JoinVault>>();
  const { invitationCode } = route.params;
  const setInvitationCode = useBoundStore((state) => state.setInvitationCode);

  const [groupId, setGroupId] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const hideTextInput = !!invitationCode;

  useEffect(() => {
    if (invitationCode) {
      setInvitationCode(undefined);
      setIsLoading(true);
      getGroupIdFromInvitation({ invitationCode })
        .then((_) => {
          if (!_) {
            return;
          }
          setGroupId(_.groupId);
          setName(_.name || '');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [invitationCode, setInvitationCode]);

  const { styles } = useStyles(stylesheet);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      const { groupName } = await onGetGroupName({ groupId });

      if (!groupName) {
        throw new Error('Group not found');
      }

      await createProfileGroup({ userId, groupId });

      updateProfile({ groupId, groupName });
      await setupDatabase({ databaseName: groupName });

      reset({
        index: 0,
        routes: [{ name: Routes.TabStack }],
      });
    } catch (e) {
      console.log(e);
      // @ts-ignore
      showErrorMessage(e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (newGroupId: string) => {
    if (errorMessages) setErrorMessages('');
    setGroupId(newGroupId);
  };

  useKeyboardForm();
  const { height, width } = useWindowDimensions();

  return (
    <>
      <View style={styles.container}>
        <ChefShare height={height / 4} width={width} style={styles.headerImage} />
        <Typography variant={'titleLarge'} style={styles.title}>
          {translate('join_vault.title')}
        </Typography>

        <Typography style={styles.subtitle} variant={'bodyMediumItalic'}>
          {hideTextInput
            ? translate('join_vault.invited_description', { vaultName: name })
            : translate('join_vault.description')}
        </Typography>

        {hideTextInput && (
          <FormInput
            value={groupId}
            onChange={handleTextChange}
            placeholder={translate('join_vault.placeholder')}
            multiline={false}
            containerStyle={styles.input}
            maxLength={40}
            errorMessage={errorMessages}
          />
        )}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            isLoading={isLoading}
            style={styles.button}
            title={translate('join_vault.button')}
            disabled={isLoading || groupId.length === 0}
            onPress={handleUpdateProfile}
          />
        </View>
        <NavBarButton iconSource={'arrow-left'} onPress={goBack} style={styles.backButton} />
      </View>
      {isLoading && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
    </>
  );
};

export default JoinVault;
