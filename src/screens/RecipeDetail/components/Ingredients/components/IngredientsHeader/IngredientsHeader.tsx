import React from 'react';

import { View } from 'react-native';
import Typography from '@/components/Typography';
import IconButton from '@/components/buttons/IconButton';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './ingredientsHeader.style';
import LabelButton from '@/components/buttons/LabelButton';
import { useBoundStore } from '@/store';
import { MenuView } from '@react-native-menu/menu';
import { RecipeUnit } from '@/services/parser/ingredients/ingredientParser';

const IngredientHeader = () => {
  const { styles, theme } = useStyles(stylesheet);
  const recipeUnit = useBoundStore((state) => state.currentRecipeUnit);

  const currentServings = useBoundStore((state) => state.currentServings);
  const setServings = useBoundStore((state) => state.setCurrentServings);
  const setRecipeUnit = useBoundStore((state) => state.setCurrentRecipeUnit);

  const handleUpdateServing = (shouldMinus: boolean) => {
    setServings(shouldMinus ? Math.max(1, currentServings - 1) : currentServings + 1);
  };

  return (
    <View style={styles.headerContainer}>
      <View>
        <MenuView
          actions={[
            { id: 'metric', title: 'Metric' },
            { id: 'original', title: 'Original' },
            { id: 'imperial', title: 'Imperial' },
          ]}
          onPressAction={({ nativeEvent }) => {
            const event = nativeEvent?.event as RecipeUnit;
            if (!event) return;
            setRecipeUnit(event);
          }}
          style={styles.menuView}
        >
          <Icon name={'fork-spoon'} size={16} color={theme.colors.onBackground} />
          <LabelButton title={recipeUnit} labelStyle={{ color: theme.colors.primary }} />
        </MenuView>
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
