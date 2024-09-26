import { MenuView } from '@react-native-menu/menu';
import { View } from 'react-native';
import Typography from '@/components/Typography';
import React from 'react';
import { useStyles } from 'react-native-unistyles';
import { BoundingBoxColors, FieldSelection } from '@/components/ImageTextSelection/types';
import Icon from '@/components/Icon';
import IconButton from '@/components/buttons/IconButton';
import { stylesheet } from './chooseFieldFooter.style';
import { translate } from '@/core';

interface Props {
  setCurrentSelection: (selection: FieldSelection) => void;
  currentSelection?: FieldSelection;
  selectedBoundingBoxColors: BoundingBoxColors;
  onRemoveSelected: (title: FieldSelection) => void;
}

const menuActions = [
  {
    id: 'title',
    title: translate('image_text_selection.title'),
  },
  {
    id: 'prepTime',
    title: translate('image_text_selection.prepTime'),
  },
  {
    id: 'cookTime',
    title: translate('image_text_selection.cookTime'),
  },
  {
    id: 'servings',
    title: translate('image_text_selection.servings'),
  },
  {
    id: 'ingredients',
    title: translate('image_text_selection.ingredients'),
  },
  {
    id: 'instructions',
    title: translate('image_text_selection.instructions'),
  },
];

const ChooseFieldFooter = ({
  setCurrentSelection,
  currentSelection,
  selectedBoundingBoxColors,
  onRemoveSelected,
}: Props) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.menuContainer}>
        {currentSelection && (
          <View
            style={[
              styles.colorIndicator,
              {
                backgroundColor: selectedBoundingBoxColors[currentSelection],
              },
            ]}
          />
        )}
        <MenuView
          actions={menuActions}
          onPressAction={({ nativeEvent }) => {
            const event = nativeEvent?.event;
            if (!event) return;
            setCurrentSelection(event as FieldSelection);
          }}
          style={styles.menuContentContainer}
        >
          <Icon name={'select'} color={theme.colors.onBackground} size={24} />
          <Typography style={styles.title}>
            {(currentSelection && translate(`image_text_selection.${currentSelection}`)) ||
              translate('image_text_selection.choose_field')}
          </Typography>
        </MenuView>
        {currentSelection && (
          <IconButton
            iconSource={'close-circle'}
            onPress={() => onRemoveSelected(currentSelection)}
            iconColor={theme.colors.onBackground}
          />
        )}
      </View>
    </View>
  );
};

export default ChooseFieldFooter;
