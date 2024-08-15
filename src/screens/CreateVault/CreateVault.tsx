import { View } from 'react-native';
import { updateProfile } from '@/store';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { showErrorMessage } from '@/utils/promptUtils';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import React, { useState } from 'react';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './createVault.style';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import FormInput from '@/components/inputs/FormInput';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import { setupDatabase } from '@/utils/databaseUtils';
import NavBarButton from '@/components/buttons/NavBarButton';
import useUserId from '@/hooks/common/useUserId';
import { onCreateGroup } from '@/services/group';

const CreateVault = () => {
  const userId = useUserId();
  const { reset, goBack } = useNavigation();

  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const { styles, theme } = useStyles(stylesheet);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      // if text contains anything other than letters setErrorMessage
      if (text.match(/[^a-zA-Z]/)) {
        setErrorMessages(
          'Please use only letters for your vault name. Numbers and Special characters are not allowed.'
        );
        setIsLoading(false);
        return;
      }

      const trimmedText = text.trim();

      const groupId = await onCreateGroup({
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
    } catch (e) {
      console.log(e);
      // @ts-ignore
      showErrorMessage(e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (newText: string) => {
    if (errorMessages) setErrorMessages(''); // Clear error messages if any exist
    setText(newText);
  };

  useKeyboardForm();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name={'cloud'} size={100} color={theme.colors.onBackground} />
        <Typography variant={'titleLarge'} style={styles.title}>
          {'Create Your Cloud Vault'}
        </Typography>
        <Typography style={styles.subtitle} variant={'bodyMediumItalic'}>
          {
            'Give your cloud vault a name. This is how it will appear to others when they join. Choose a name that’s easy to remember and reflects the essence of your culinary collection.'
          }
        </Typography>
      </View>
      <FormInput
        value={text}
        onChange={handleTextChange}
        placeholder={'Name Your Vault'}
        multiline={false}
        containerStyle={styles.input}
        maxLength={10}
        errorMessage={errorMessages}
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton
          isLoading={isLoading}
          style={styles.button}
          title={'Create Vault'}
          disabled={isLoading || text.length === 0}
          onPress={handleUpdateProfile}
        />
      </View>
      <NavBarButton
        iconSource={'arrow-left'}
        onPress={goBack}
        disabled={isLoading}
        style={styles.backButton}
      />
    </View>
  );
};
export default CreateVault;
