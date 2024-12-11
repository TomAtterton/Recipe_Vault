import React from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import Typography from '@/components/Typography';
import Icon from '@/components/Icon';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useBoundStore } from '@/store';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { translate } from '@/core';
import { Image } from 'expo-image';

const AVATAR_SIZE = 100;

const Avatar = ({}) => {
  const { styles, theme } = useStyles(stylesheet);
  const name = useBoundStore((state) => state.profile.name);
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

  return (
    <Pressable
      style={({ pressed }) => [styles.avatarContainer, { opacity: pressed ? 0.7 : 1 }]}
      onPress={handlePress}
    >
      <View style={[styles.avatarCircle, { borderColor: theme.colors.onBackground }]}>
        <Image
          source={require('../../../assets/images/avatar.png')}
          style={{ width: 80, height: 80 }}
        />
        <TouchableOpacity
          onPress={handlePress}
          style={styles.cogIconContainer}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name={'cog'} size={20} color={theme.colors.onBackground} />
        </TouchableOpacity>
      </View>
      {isLoggedIn ? (
        <>
          {/*// @ts-ignore*/}
          <Typography variant={'bodyLargeItalic'} style={styles.avatarName}>
            {name}
          </Typography>
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
  cogIconContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    marginTop: 8,
    textAlign: 'center',
  },
}));

export default Avatar;
