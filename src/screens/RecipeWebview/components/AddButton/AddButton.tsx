import Animated, { SlideInDown } from 'react-native-reanimated';
import { stylesheet } from './addButton.style';
import React from 'react';
import { useStyles } from 'react-native-unistyles';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { translate } from '@/core';

interface Props {
  handleAddRecipe: () => void;
}

const AnimatedButton = Animated.createAnimatedComponent(PrimaryButton);

const AddButton = ({ handleAddRecipe }: Props) => {
  const { styles } = useStyles(stylesheet);
  return (
    <AnimatedButton
      entering={SlideInDown.duration(800)}
      style={styles.recipeButton}
      onPress={handleAddRecipe}
      title={translate('recipe_webview.add_recipe')}
    />
  );
};

export default AddButton;
