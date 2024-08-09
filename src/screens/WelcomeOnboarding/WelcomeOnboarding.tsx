import { View } from 'react-native';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import React from 'react';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './welcomeOnboarding.style';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import LabelButton from '@/components/buttons/LabelButton';
import { onSignOut } from '@/services/auth';
import NavBarButton from '@/components/buttons/NavBarButton';

const WelcomeOnboarding = () => {
  const { reset, goBack, navigate } = useNavigation();

  const { styles, theme } = useStyles(stylesheet);

  const handleSharedVault = () => {
    navigate(Routes.CreateVault);
  };

  const handleJoinVault = () => {
    navigate(Routes.JoinVault);
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
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name={'cloud'} size={100} color={theme.colors.onBackground} />
        <Typography variant={'titleLarge'} style={styles.title}>
          {'Welcome to Your Recipe Vault!'}
        </Typography>
        <Typography style={styles.subtitle} variant={'bodyMediumItalic'}>
          {
            'Start by creating a cloud vault to sync your recipes with friends and family, or join an existing one to discover and contribute. Let’s get cooking!'
          }
        </Typography>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          style={styles.button}
          title={'Create a cloud vault'}
          onPress={handleSharedVault}
        />
        <PrimaryButton
          style={styles.button}
          title={'Join a cloud vault'}
          onPress={handleJoinVault}
        />

        <LabelButton title={'logout'} onPress={handleLogout} />
      </View>
      <NavBarButton
        iconSource={'arrow-left'}
        onPress={goBack}
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
        }}
      />
    </View>
  );
};
export default WelcomeOnboarding;
