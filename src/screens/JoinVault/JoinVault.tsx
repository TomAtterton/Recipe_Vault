import { useWindowDimensions, View } from 'react-native';
import { updateProfile } from '@/store';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { showErrorMessage } from '@/utils/promptUtils';
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
import ChefShare from '../../../assets/svgs/chef_share.svg';
import { translate } from '@/core';

const JoinVault = () => {
  const userId = useUserId();
  const { reset, goBack } = useNavigation();

  const [groupId, setGroupId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const { styles } = useStyles(stylesheet);

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
  const { height, width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <ChefShare height={height / 4} width={width} style={styles.headerImage} />
      <Typography variant={'titleLarge'} style={styles.title}>
        {translate('join_vault.title')}
      </Typography>
      <Typography style={styles.subtitle} variant={'bodyMediumItalic'}>
        {translate('join_vault.description')}
      </Typography>
      <FormInput
        value={groupId}
        onChange={handleTextChange}
        placeholder={translate('join_vault.placeholder')}
        multiline={false}
        containerStyle={styles.input}
        maxLength={40}
        errorMessage={errorMessages}
      />

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
  );
};
export default JoinVault;
