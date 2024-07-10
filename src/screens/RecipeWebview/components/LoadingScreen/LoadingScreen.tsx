import { ActivityIndicator, View } from 'react-native';
import styles from './loadingScreen.style';
import React from 'react';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';

const LoadingScreen = () => {
  const {
    theme: { colors },
  } = useStyles();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant={'displaySmall'} style={styles.text}>
        Cooking up your recipe
      </Typography>
      <ActivityIndicator animating />
    </View>
  );
};
export default LoadingScreen;
