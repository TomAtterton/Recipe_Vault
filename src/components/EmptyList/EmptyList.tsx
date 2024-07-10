import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import styles from './emptyList.style';
import Typography from '@/components/Typography';

type Props = {
  isLoading: boolean;
};
const EmptyList = React.memo(({ isLoading }: Props) => {
  return (
    <View style={styles.container}>
      {!isLoading ? (
        <View style={styles.contentContainer}>
          {/*<NoData />*/}
          <Typography>Sorry! No data found</Typography>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
});

export default EmptyList;
