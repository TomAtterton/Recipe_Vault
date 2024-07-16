import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';

import { SafeAreaView, View } from 'react-native';
import useHandleAuth from './useHandleAuth';
import { translate } from '@/core';
import LabelButton from '@/components/buttons/LabelButton';
import Icon from '@/components/Icon';
import { stylesheet } from './login.style';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Login = () => {
  const { onAppleLogin, onTestLogin } = useHandleAuth();
  const { styles, theme } = useStyles(stylesheet);
  const { top } = useSafeAreaInsets();
  const { navigate } = useNavigation();

  const handleSkip = () => navigate(Routes.TabStack);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name={'cloud'} size={100} color={theme.colors.onBackground} />
        <Typography variant={'titleLarge'} style={styles.title}>
          Create a cloud vault
        </Typography>
        <Typography variant={'bodyMedium'} style={styles.subtitle}>
          Save your recipes in the cloud invite friends to join your vault and keep up to date with
          mealplans.
        </Typography>
      </View>
      <View style={styles.loginButtonContainer}>
        <Typography variant={'bodyMediumItalic'} style={styles.footerText}>
          Currently in beta so only limited to 5 recipes at this moment.
        </Typography>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
          cornerRadius={5}
          style={styles.loginButton}
          onPress={onAppleLogin}
        />
        {__DEV__ && (
          <LabelButton onPress={onTestLogin} title={translate('login.test_login_title')} />
        )}
      </View>
      <NavBarButton
        iconSource={'close'}
        style={{
          position: 'absolute',
          top: top,
          right: 0,
        }}
        onPress={handleSkip}
      />
    </SafeAreaView>
  );
};

export default Login;
