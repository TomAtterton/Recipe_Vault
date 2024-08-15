import { View } from 'react-native';
import { updateProfile } from '@/store';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { showErrorMessage } from '@/utils/promptUtils';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import React, { useState } from 'react';
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

const JoinVault = () => {
  const userId = useUserId();
  const { reset, goBack } = useNavigation();

  const [groupId, setGroupId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const { styles, theme } = useStyles(stylesheet);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      const { groupName } = await onGetGroupName({
        groupId,
      });

      if (!groupName) {
        throw new Error('Group not found');
      }

      await createProfileGroup({
        userId,
        groupId,
      });

      updateProfile({
        groupId,
        groupName,
      });

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
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name={'share'} size={100} color={theme.colors.onBackground} />
        <Typography variant={'titleLarge'} style={styles.title}>
          {'Join Cloud Vault'}
        </Typography>
        <Typography style={styles.subtitle} variant={'bodyMediumItalic'}>
          {
            'Have a vault code? Enter it here to join a cloud vault and explore a world of recipes with up to two friends or family. If you don’t have one, consider creating your own vault!'
          }
        </Typography>
      </View>
      <FormInput
        value={groupId}
        onChange={handleTextChange}
        placeholder={'Enter Vault Code'}
        multiline={false}
        containerStyle={styles.input}
        maxLength={40}
        errorMessage={errorMessages}
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton
          isLoading={isLoading}
          style={styles.button}
          title={'Join Vault'}
          disabled={isLoading || groupId.length === 0}
          onPress={handleUpdateProfile}
        />
      </View>
      <NavBarButton iconSource={'arrow-left'} onPress={goBack} style={styles.backButton} />
    </View>
  );
};
export default JoinVault;
