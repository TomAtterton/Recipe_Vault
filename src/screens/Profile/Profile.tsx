import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Typography from '@/components/Typography';
import React, { useState } from 'react';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './profile.style';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import FormInput from '@/components/inputs/FormInput';
import { useBoundStore } from '@/store';
import { showErrorMessage } from '@/utils/promptUtils';
import { updateProfile } from '@/services/profile';
import { Routes } from '@/navigation/Routes';
import { translate } from '@/core';

const Profile = () => {
  const { reset } = useNavigation();

  const { styles } = useStyles(stylesheet);

  const userId = useBoundStore((state) => state.session?.user.id);

  const [name, setName] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const handleTextChange = (newText: string) => {
    if (errorMessages) setErrorMessages(''); // Clear error messages if any exist
    setName(newText);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (name.match(/[^a-zA-Z0-9]/)) {
        throw new Error(translate('profile.error_message'));
      }
      const lowerCaseName = name.trim().toLowerCase();

      await updateProfile({
        data: {
          name: lowerCaseName,
        },
      });
      if (!userId) {
        reset({
          index: 0,
          routes: [{ name: Routes.WelcomeOnboarding }],
        });
      } else {
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

  useKeyboardForm();
  return (
    <View style={styles.container}>
      <Typography variant={'titleLarge'} style={styles.title}>
        {translate('profile.title')}
      </Typography>
      <Typography style={styles.subtitle} variant={'bodyMediumItalic'}>
        {translate('profile.subtitle')}
      </Typography>
      <FormInput
        value={name}
        onChange={handleTextChange}
        placeholder={translate('profile.placeholder')}
        multiline={false}
        containerStyle={styles.input}
        maxLength={20}
        errorMessage={errorMessages}
      />
      <PrimaryButton
        title={translate('profile.button')}
        onPress={handleSubmit}
        disabled={name.length < 3}
        isLoading={isLoading}
      />
    </View>
  );
};
export default Profile;
