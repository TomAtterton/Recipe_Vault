import React from 'react';
import { View } from 'react-native';

import { stylesheet } from './titleContent.style';
import Typography from '@/components/Typography';
import LabelButton from '@/components/buttons/LabelButton';
import { useStyles } from 'react-native-unistyles';
import { translate } from '@/core';

interface Props {
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

const TitleContent = ({ title, showSeeAll, onSeeAll }: Props) => {
  const { styles } = useStyles(stylesheet);

  if (!title) return;

  return (
    <View style={styles.container}>
      <Typography variant={'titleMedium'}>{title}</Typography>
      {showSeeAll && (
        <LabelButton
          title={translate('default.see_all')}
          onPress={onSeeAll}
          style={styles.seeAllButton}
        />
      )}
    </View>
  );
};

export default TitleContent;
