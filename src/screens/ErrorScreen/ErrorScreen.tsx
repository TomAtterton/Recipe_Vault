import { View } from 'react-native';
import ChefFire from '../../../assets/svgs/chef_fire.svg';
import Typography from '@/components/Typography';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import LabelButton from '@/components/buttons/LabelButton';
import React from 'react';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { handleMail } from '@/utils/mailUtils';

const ErrorScreen = ({ error, resetError }: { error: Error; resetError: () => void }) => {
  const { styles } = useStyles(stylesheet);

  const handleReport = () =>
    handleMail({
      headerText:
        'Hello,\n      \n      I would like to report an issue with Recipe Vault. Here are the details:',
      errorMessage: error?.message,
    });

  return (
    <View style={styles.container}>
      <ChefFire />
      <Typography variant={'titleMedium'}>{'Something went wrong'}</Typography>
      <Typography
        numberOfLines={5}
        variant={'bodyMediumItalic'}
      >{`Error: ${error?.message}`}</Typography>
      <PrimaryButton title={'Reload'} onPress={resetError} />
      <LabelButton title={'Report'} onPress={handleReport} />
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
