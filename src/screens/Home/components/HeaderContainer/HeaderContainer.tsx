import { View } from 'react-native';
import { Routes } from '@/navigation/Routes';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { stylesheet } from './headerContainer.style';
import HomeAnimation from '@/screens/Home/homeAnimation';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import IconButton from '@/components/buttons/IconButton';
import { translate } from '@/core';

const HeaderContainer = () => {
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);
  const { navigate } = useNavigation();

  const handleSettingsPress = () => navigate(Routes.Settings);

  return (
    <Animated.View style={styles.container} {...HomeAnimation.headerContainerAnimation}>
      <View style={styles.textContainer}>
        <View>
          <Typography variant={'headlineLarge'} style={styles.title}>
            {translate('home.header.title')}
          </Typography>
          <Typography variant={'headlineLarge'} style={styles.subTitle}>
            {translate('home.header.subtitle')}
          </Typography>
        </View>
      </View>
      <IconButton
        style={styles.avatarContainer}
        iconColor={colors.onBackground}
        iconSource={'profile'}
        iconSize={40}
        buttonSize={'large'}
        onPress={handleSettingsPress}
      />
    </Animated.View>
  );
};

export default HeaderContainer;
