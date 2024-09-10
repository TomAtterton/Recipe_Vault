import { View } from 'react-native';
import ChefFire from '../../../assets/svgs/chef_fire.svg';
import Typography from '@/components/Typography';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import LabelButton from '@/components/buttons/LabelButton';
import React from 'react';
import { openURL } from 'expo-linking';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const ErrorScreen = ({ error, resetError }: { error: Error; resetError: () => void }) => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <ChefFire />
      <Typography variant={'titleMedium'}>{'Something went wrong'}</Typography>
      <Typography variant={'bodyMediumItalic'}>{`Error: ${error?.message}`}</Typography>
      <PrimaryButton title={'Reload'} onPress={resetError} />
      <LabelButton title={'Report'} onPress={() => openURL('mailto:hello@tomatterton.com')} />
    </View>
  );
};

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    gap: 16,
  },
}));

export default ErrorScreen;
