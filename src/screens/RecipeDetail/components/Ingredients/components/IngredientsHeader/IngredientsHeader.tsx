import React from 'react';

import { View } from 'react-native';
import Typography from '@/components/Typography';
import IconButton from '@/components/buttons/IconButton';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './ingredientsHeader.style';
import LabelButton from '@/components/buttons/LabelButton';
import { useBoundStore } from '@/store';

const IngredientHeader = ({
  isMetric,
  setIsMetric,
}: {
  isMetric: boolean;
  setIsMetric: (isMetric: boolean) => void;
}) => {
  const { styles, theme } = useStyles(stylesheet);

  const currentServings = useBoundStore((state) => state.currentServings);
  const setServings = useBoundStore((state) => state.setCurrentServings);

  const handleUpdateServing = (shouldMinus: boolean) => {
    setServings(shouldMinus ? Math.max(1, currentServings - 1) : currentServings + 1);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.systemContainer}>
        <LabelButton
          title={'Metric'}
          style={[
            styles.systemButton,
            {
              backgroundColor: isMetric ? theme.colors.primary : 'transparent',
            },
          ]}
          labelStyle={{ color: isMetric ? theme.colors.background : theme.colors.onBackground }}
          onPress={() => setIsMetric(true)}
        />
        <LabelButton
          title={'Imperial'}
          style={[
            styles.systemButton,
            {
              backgroundColor: !isMetric ? theme.colors.primary : 'transparent',
            },
          ]}
          labelStyle={{ color: !isMetric ? theme.colors.background : theme.colors.onBackground }}
          onPress={() => setIsMetric(false)}
        />
      </View>
      <View style={styles.servingsContainer}>
        <IconButton
          iconSource={'minus'}
          onPress={() => handleUpdateServing(true)}
          buttonSize={'small'}
        />
        <Icon name={'people-outline'} size={16} color={theme.colors.onBackground} />
        <Typography variant="titleSmall" style={styles.servingsText}>
          {currentServings}
        </Typography>

        <IconButton
          iconSource={'plus'}
          onPress={() => handleUpdateServing(false)}
          buttonSize={'small'}
        />
      </View>
    </View>
  );
};

export default IngredientHeader;
