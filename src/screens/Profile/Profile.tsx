import { SafeAreaView, View } from 'react-native';
import { updateProfile, useBoundStore } from '@/store';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { showErrorMessage } from '@/utils/promptUtils';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import React, { useState } from 'react';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './profile.style';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { IconName } from '@/components/Icon/types';
import FormInput from '@/components/inputs/FormInput';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import { createGroup, createProfileGroup } from 'src/services/group';
import { getProfileGroupByGroupId } from '@/services/profileGroup';
import { setupDatabase } from '@/utils/databaseUtils';
import LabelButton from '@/components/buttons/LabelButton';
import { onSignOut } from '@/services/auth';
import { translate } from '@/core';

enum ProfileState {
  INITIAL = 'initial',
  CREATE = 'create',
  JOIN = 'join',
}

const IconSource = {
  [ProfileState.INITIAL]: 'cloud',
  [ProfileState.CREATE]: 'cloud',
  [ProfileState.JOIN]: 'share',
};

const Title = {
  [ProfileState.INITIAL]: 'Welcome to Your Recipe Vault!',
  [ProfileState.CREATE]: 'Create Your Cloud Vault',
  [ProfileState.JOIN]: 'Join Cloud Vault',
};

const Description = {
  [ProfileState.INITIAL]:
    'Start by creating a cloud vault to sync your recipes with friends and family, or join an existing one to discover and contribute. Let’s get cooking!',
  [ProfileState.CREATE]:
    'Give your cloud vault a name. This is how it will appear to others when they join. Choose a name that’s easy to remember and reflects the essence of your culinary collection.',
  [ProfileState.JOIN]:
    'Have a vault code? Enter it here to join a cloud vault and explore a world of recipes with up to two friends or family. If you don’t have one, consider creating your own vault!',
};

const Placeholder = {
  [ProfileState.INITIAL]: '',
  [ProfileState.CREATE]: 'Name Your Vault',
  [ProfileState.JOIN]: 'Enter Vault Code',
};

const MaxLength = {
  [ProfileState.INITIAL]: 0,
  [ProfileState.CREATE]: 10,
  [ProfileState.JOIN]: 40,
};

const Profile = () => {
  const userId = useBoundStore((state) => state.profile?.id);
  const { reset } = useNavigation();

  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      if (currentState === ProfileState.CREATE) {
        // if text contains anything other than letters setErrorMessage
        if (text.match(/[^a-zA-Z]/)) {
          setErrorMessages(
            'Please use only letters for your vault name. Numbers and Special characters are not allowed.'
          );
          setIsLoading(false);
          return; // Stop the execution if there's an error
        }
        // remove whitespace from text
        const trimmedText = text.trim();

        const groupId = await createGroup({
          name: trimmedText,
          userId,
        });

        updateProfile({
          groupId,
          groupName: trimmedText,
        });

        await setupDatabase({ databaseName: trimmedText });

        reset({
          index: 0,
          routes: [{ name: Routes.TabStack }],
        });
      } else {
        await createProfileGroup({
          userId,
          groupId: text,
        });

        const { groupName } = await getProfileGroupByGroupId({
          groupId: text,
        });

        if (!groupName) {
          throw new Error('Group not found');
        }

        updateProfile({
          groupId: text,
          groupName,
        });

        await setupDatabase({ databaseName: groupName });

        reset({
          index: 0,
          routes: [{ name: Routes.TabStack }],
        });
      }
    } catch (e) {
      console.log(e);
      // @ts-ignore
      showErrorMessage(e?.message);
    } finally {
      setIsLoading(false);
    }
  };
  const { styles, theme } = useStyles(stylesheet);

  const [currentState, setCurrentState] = React.useState(ProfileState.INITIAL);

  const isInitial = currentState === ProfileState.INITIAL;

  const handleSharedVault = () => {
    setCurrentState(ProfileState.CREATE);
  };

  const handleJoinVault = () => {
    setCurrentState(ProfileState.JOIN);
  };
  const handleTextChange = (newText: string) => {
    if (errorMessages) setErrorMessages(''); // Clear error messages if any exist
    setText(newText);
  };
  const handleLogout = () => {
    onSignOut();
    reset({
      index: 0,
      routes: [{ name: Routes.TabStack }],
    });
  };

  useKeyboardForm();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon
          name={IconSource[currentState] as IconName}
          size={100}
          color={theme.colors.onBackground}
        />
        <Typography variant={'titleLarge'} style={styles.title}>
          {Title[currentState]}
        </Typography>
        <Typography style={styles.subtitle} variant={'bodyMediumItalic'}>
          {Description[currentState]}
        </Typography>
      </View>
      {!isInitial && (
        <FormInput
          value={text}
          onChange={handleTextChange}
          placeholder={Placeholder[currentState]}
          multiline={false}
          containerStyle={styles.input}
          maxLength={MaxLength[currentState]}
          errorMessage={errorMessages}
        />
      )}

      <View style={styles.buttonContainer}>
        {isInitial && (
          <PrimaryButton
            style={styles.button}
            title={'Create a cloud vault'}
            onPress={handleSharedVault}
          />
        )}
        {isInitial && (
          <PrimaryButton
            style={styles.button}
            title={'Join a cloud vault'}
            onPress={handleJoinVault}
          />
        )}
        {!isInitial ? (
          <>
            <PrimaryButton
              isLoading={isLoading}
              style={styles.button}
              title={currentState === ProfileState.JOIN ? 'Join Vault' : 'Create Vault'}
              disabled={isLoading || text.length === 0}
              onPress={handleUpdateProfile}
            />
            <LabelButton
              title={translate('default.cancel')}
              onPress={() => setCurrentState(ProfileState.INITIAL)}
            />
          </>
        ) : (
          <LabelButton title={'logout'} onPress={handleLogout} />
        )}
      </View>
    </SafeAreaView>
  );
};
export default Profile;
