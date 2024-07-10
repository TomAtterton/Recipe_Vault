import React from 'react';

import { View } from 'react-native';
import Typography from '@/components/Typography';
import IconButton from '@/components/buttons/IconButton';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/screens/RecipeDetail/components/Ingredients/components/IngredientsHeader/ingredientsHeader.style';

const IngredientHeader = ({
  setServings,
  servings,
}: {
  setServings: (servings: number) => void;
  servings: number;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.servingsContainer}>
        <IconButton
          iconSource={'minus'}
          onPress={() => setServings(Math.max(1, servings - 1))}
          buttonSize={'small'}
        />
        <Icon name={'people-outline'} size={16} color={theme.colors.onBackground} />
        <Typography variant="titleSmall" style={styles.servingsText}>
          {servings}
        </Typography>

        <IconButton
          iconSource={'plus'}
          onPress={() => setServings(servings + 1)}
          buttonSize={'small'}
        />
      </View>
    </View>
  );
};

export default IngredientHeader;
