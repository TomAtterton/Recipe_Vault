import { useWindowDimensions, View } from 'react-native';
import { updateProfile } from '@/store';
import { Routes } from '@/navigation/Routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showErrorMessage } from '@/utils/promptUtils';
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
import ChefMeals from '../../../assets/svgs/chef_meals.svg';
import { RouteProp } from '@/navigation/types';
import LabelButton from '@/components/buttons/LabelButton';

const CreateVault = () => {
  const userId = useUserId();
  const { reset, goBack } = useNavigation();

  const {
    params: { showSkip },
  } = useRoute<RouteProp<Routes.CreateVault>>();

  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const { styles } = useStyles(stylesheet);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      // if text contains anything other than letters setErrorMessage
      if (text.match(/[^a-zA-Z]/)) {
        setErrorMessages(
          'Please use only letters for your vault name. Numbers and Special characters are not allowed.',
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
    if (newText.match(/[^a-zA-Z]/)) {
      setErrorMessages(
        'Vault names can only include letters. Spaces, numbers, and special characters aren’t allowed.',
      );
    } else {
      setErrorMessages('');
    }
    setText(newText);
  };

  useKeyboardForm();

  const { height, width } = useWindowDimensions();

  const handleSkip = () => {
    reset({
      index: 0,
      routes: [{ name: Routes.TabStack }],
    });
  };

  return (
    <View style={styles.container}>
      <ChefMeals height={height / 4} width={width} style={styles.chefMealImage} />
      <Typography variant={'titleLarge'} style={styles.title}>
        {'Create Your Cloud Vault'}
      </Typography>
      <Typography style={styles.subtitle} variant={'bodyMediumItalic'}>
        {
          'Choose a memorable name for your cloud vault. This will be visible to others when they join, so make it simple and reflective of your culinary collection.'
        }
      </Typography>
      <FormInput
        value={text}
        onChange={handleTextChange}
        placeholder={'Enter vault name'}
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
        {showSkip && <LabelButton title={'Continue with local vault'} onPress={handleSkip} />}
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
