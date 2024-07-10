import React from 'react';
import { TouchableOpacity, View } from 'react-native';

type Props = RecipeSearchItemType & { onPress?: () => void };

import styles from './verticalCard.style';
import { RecipeSearchItemType } from '@/database/api/recipes/hooks/useFilterRecipe';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import Icon from '@/components/Icon';
import SquircleImage from '@/components/SquircleImage';

const VerticalCard = ({ name, rating, performTime, image, onPress = () => {} }: Props) => {
  const { theme } = useStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View>
        <SquircleImage
          source={{
            uri: image,
          }}
          width={100}
          height={100}
        />
      </View>
      <View style={styles.textContainer}>
        <Typography variant={'titleMedium'} numberOfLines={2}>
          {name}
        </Typography>
        <View style={styles.metaContainer}>
          {!!performTime && (
            <View style={styles.cookTimeContainer}>
              <Icon name={'clock'} color={theme.colors.primary} size={16} />
              <Typography
                style={[styles.metaTitle, { color: theme.colors.primary }]}
                variant={'bodyMedium'}
                numberOfLines={1}
              >
                {performTime}
              </Typography>
            </View>
          )}

          {rating !== 0 && (
            <>
              <Icon name={'star'} color={theme.colors.primary} size={16} />
              <Typography
                style={[styles.metaTitle, { color: theme.colors.primary }]}
                variant={'bodyMedium'}
              >
                {rating}
              </Typography>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VerticalCard;
