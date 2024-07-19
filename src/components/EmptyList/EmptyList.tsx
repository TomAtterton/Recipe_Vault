import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import styles from './emptyList.style';
import Typography from '@/components/Typography';
import { translate } from '@/core';

type Props = {
  isLoading: boolean;
};
const EmptyList = React.memo(({ isLoading }: Props) => {
  return (
    <View style={styles.container}>
      {!isLoading ? (
        <View style={styles.contentContainer}>
          <Typography>{translate('empty.no_results')}</Typography>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
});

export default EmptyList;
