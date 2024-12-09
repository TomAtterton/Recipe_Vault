import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Typography from '@/components/Typography';
import Icon from '@/components/Icon';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useBoundStore } from '@/store';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { translate } from '@/core';
import { Env } from '@/core/env';

const AVATAR_SIZE = 80;

const Avatar = ({}) => {
  const { styles, theme } = useStyles(stylesheet);
  const name = useBoundStore((state) => state.profile.name);
  const vaultName = useBoundStore((state) => state.profile.groupName);
  const isLoggedIn = useIsLoggedIn();
  const navigation = useNavigation();
  const handlePress = () => {
    if (isLoggedIn) {
      // Navigate to profile screen
      navigation.navigate(Routes.AccountSettings);
    } else {
      // Navigate to login screen
      navigation.navigate(Routes.Login, {
        showSkip: false,
      });
    }
  };

  const vaultTitle = useMemo(
    () =>
      vaultName === Env.SQLITE_DB_NAME ? translate('database_settings.local_vault') : vaultName,
    [vaultName],
  );

  return (
    <Pressable
      style={({ pressed }) => [styles.avatarContainer, { opacity: pressed ? 0.7 : 1 }]}
      onPress={handlePress}
    >
      <View style={[styles.avatarCircle, { borderColor: theme.colors.onBackground }]}>
        <Icon name="profile" size={AVATAR_SIZE / 2} color={theme.colors.primary} />
      </View>
      {isLoggedIn ? (
        <>
          <Typography variant={'bodyMediumItalic'} style={styles.avatarName}>
            {name}
          </Typography>
          <View style={styles.vaultContainer}>
            <Icon name={'vault'} size={16} color={theme.colors.onBackground} />
            <Typography variant={'bodyMediumItalic'} style={styles.vaultName}>
              {vaultTitle}
            </Typography>
          </View>
        </>
      ) : (
        <Typography variant={'bodyMediumItalic'} style={styles.loginText}>
          {translate('settings.login')}
        </Typography>
      )}
    </Pressable>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2, // Add border width
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarName: {
    marginTop: 8,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: theme.colors.primary,
  },
  vaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  vaultName: {
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  loginText: {
    marginTop: 8,
    textAlign: 'center',
  },
}));

export default Avatar;
