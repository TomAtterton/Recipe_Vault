import { ActivityIndicator, View } from 'react-native';
import styles from './loadingScreen.style';
import React from 'react';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { translate } from '@/core';

const LoadingScreen = () => {
  const {
    theme: { colors },
  } = useStyles();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant={'displaySmall'} style={styles.text}>
        {translate('loading_screen.loading_message')}
      </Typography>
      <ActivityIndicator animating />
    </View>
  );
};
export default LoadingScreen;
