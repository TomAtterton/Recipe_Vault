import React from 'react';
import { View } from 'react-native';

import Image from '@/components/Image';
import RecipeHeaderContent from './components/RecipeHeaderContent';
import useAnimatedValues from './useAnimatedVaules';
import EditButton from './components/EditButton';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './recipeHeader.style';
import Animated from 'react-native-reanimated';
import NavBarButton from '@/components/buttons/NavBarButton';

const RecipeHeader = ({
  recipeId,
  image,
  isAnimated = false,
}: {
  recipeId: string;
  image: string | null;
  isAnimated: boolean;
}) => {
  const { styles } = useStyles(stylesheet);

  const { animatedStyle, animatedImageScaleStyle, animatedNavBarStyle, top, goBack } =
    useAnimatedValues(isAnimated);

  const Container = isAnimated ? Animated.View : View;

  return (
    <Container
      style={isAnimated ? animatedStyle : styles.container}
      pointerEvents={isAnimated ? 'box-none' : 'auto'}
    >
      <Image
        style={[styles.image, animatedImageScaleStyle]}
        source={{
          uri: image,
        }}
      />
      {isAnimated && (
        <Animated.View
          pointerEvents={'box-none'}
          style={[styles.topNavigation, { top }, animatedNavBarStyle]}
        >
          <NavBarButton iconSource={'arrow-left'} onPress={goBack} />
          <EditButton id={recipeId} />
        </Animated.View>
      )}
      <RecipeHeaderContent id={recipeId} />
    </Container>
  );
};

export default RecipeHeader;
