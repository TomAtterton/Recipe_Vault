import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import styles from './titleContent.style';
import Typography from '@/components/Typography';
import LabelButton from '@/components/buttons/LabelButton';

interface Props {
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

const TitleContent = ({ title, showSeeAll, onSeeAll }: Props) => {
  if (!title) return;

  return (
    <View style={styles.container}>
      <Typography variant={'titleMedium'}>{title}</Typography>
      {showSeeAll && (
        <LabelButton title={'see all'} onPress={onSeeAll} style={styles.seeAllButton} />
      )}
    </View>
  );
};

export default TitleContent;
