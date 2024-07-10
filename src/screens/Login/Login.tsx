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

const Login = () => {
  const { onAppleLogin, onTestLogin } = useHandleAuth();
  const { styles, theme } = useStyles(stylesheet);
  const navigation = useNavigation();

  const handleSkip = () => {
    navigation.navigate(Routes.TabStack);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name={'cloud'} size={100} color={theme.colors.onBackground} />
        <Typography variant={'titleMedium'} style={styles.title}>
          Login in order to sync your recipes with our cloud.
        </Typography>
      </View>
      <View style={styles.loginButtonContainer}>
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
        <LabelButton onPress={handleSkip} title={'skip'} />
      </View>
    </SafeAreaView>
  );
};

export default Login;
