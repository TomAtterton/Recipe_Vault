import { useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Typography from '@/components/Typography';
import React, { useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import FormInput from '@/components/inputs/FormInput';
import { useBoundStore } from '@/store';
import { showErrorMessage } from '@/utils/promptUtils';
import { updateProfile } from '@/services/profile';
import { Routes } from '@/navigation/Routes';
import { translate } from '@/core';
import ChefShare from '../../../assets/svgs/chef_cut.svg';

const Profile = () => {
  const { reset } = useNavigation();

  const { styles } = useStyles(stylesheet);

  const userId = useBoundStore((state) => state.session?.user.id);
  const invitationCode = useBoundStore((state) => state.invitationCode);

  const [name, setName] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const handleTextChange = (newText: string) => {
    const invalidCharacters = /[^a-zA-Z0-9]/;
    if (invalidCharacters.test(newText)) {
      setErrorMessages(translate('profile.error_message'));
    } else {
      setErrorMessages(''); // Clear error message if the input is valid
    }
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
          routes: [{ name: Routes.CreateVault, params: { showSkip: true } }],
        });
      } else {
        if (invitationCode) {
          reset({
            index: 0,
            routes: [
              { name: Routes.TabStack },
              {
                name: Routes.JoinVault,
                params: {
                  invitationCode,
                },
              },
            ],
          });
          return;
        }
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
  const { height, width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <ChefShare height={height / 4} width={width} style={styles.headerImage} />

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
        disabled={name.length < 3 || errorMessages.length > 0}
        isLoading={isLoading}
      />
    </View>
  );
};

const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    paddingTop: miniRuntime.insets.top + 40,
    paddingBottom: miniRuntime.insets.bottom,
    flex: 1,
    marginHorizontal: 20,
  },
  headerImage: {
    alignSelf: 'center',
  },
  title: {
    paddingTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    paddingTop: 20,
    textAlign: 'center',
  },
  input: {
    marginTop: 40,
  },
}));

export default Profile;
