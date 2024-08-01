import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IMAGE_HEIGHT, IMAGE_WIDTH, stylesheet } from './horizontalCard.style';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';

import { RecipeDetailType } from '@/types';
import SquircleImage from '@/components/SquircleImage';

type Props = Partial<RecipeDetailType> & { onPress?: () => void };

const shortenPerformTime = (performTime: string) => {
  // perform time will return 1 hour, 2 hours , 20 minutes , 1 min but I want to shorten it to 1h, 2h, 20m, 1m
  const performTimeArr = performTime.split(' ');
  const time = performTimeArr[0];
  const unit = performTimeArr[1];
  if (unit === 'hour' || unit === 'hours') {
    return `${time}h`;
  } else {
    return `${time}m`;
  }
};

const HorizontalCard = ({ name, rating, performTime, image, onPress = () => {} }: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <SquircleImage
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
        source={image ? { url: image } : null}
      />
      <View style={styles.textContainer}>
        <Typography style={styles.title} variant={'titleMedium'} numberOfLines={2}>
          {name}
        </Typography>
        <View style={styles.metaContainer}>
          {!!performTime && (
            <View style={styles.cookTimeContainer}>
              <Icon name={'clock'} color={theme.colors.primary} size={16} />
              <Typography style={styles.metaTitle} variant={'titleMedium'} numberOfLines={1}>
                {shortenPerformTime(performTime)}
              </Typography>
            </View>
          )}
          {rating !== 0 && (
            <>
              <Icon name={'star'} color={theme.colors.primary} size={16} />
              <Typography style={styles.metaTitle} variant={'titleMedium'}>
                {rating}
              </Typography>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HorizontalCard;
