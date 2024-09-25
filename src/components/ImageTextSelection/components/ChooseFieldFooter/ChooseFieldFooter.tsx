import { MenuView } from '@react-native-menu/menu';
import { View } from 'react-native';
import Typography from '@/components/Typography';
import React from 'react';
import { useStyles } from 'react-native-unistyles';
import { BoundingBoxColors, FieldSelection } from '@/components/ImageTextSelection/types';
import OutlineButton from '@/components/buttons/OutlineButton';
import Icon from '@/components/Icon';
import IconButton from '@/components/buttons/IconButton';
import { stylesheet } from './chooseFieldFooter.style';
import { translate } from '@/core';

interface Props {
  onAdd: () => void;
  setCurrentSelection: (selection: FieldSelection) => void;
  currentSelection?: FieldSelection;
  selectedBoundingBoxColors: BoundingBoxColors;
  onCancel: () => void;
  onGenerateRecipe: () => void;
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
  onAdd,
  onGenerateRecipe,
  setCurrentSelection,
  currentSelection,
  selectedBoundingBoxColors,
  onCancel,
}: Props) => {
  const { styles, theme } = useStyles(stylesheet);

  const handleAdd = () => {
    if (currentSelection) {
      return onAdd();
    }
    onGenerateRecipe();
  };

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
            onPress={onCancel}
            iconColor={theme.colors.onBackground}
          />
        )}
      </View>
      <Typography style={styles.description} variant={'bodyMediumItalic'}>
        {currentSelection
          ? translate('image_text_selection.choose_field_description')
          : translate('image_text_selection.generate_recipe_description')}
      </Typography>
      <OutlineButton
        style={styles.addButton}
        title={
          currentSelection
            ? translate('image_text_selection.add_selection')
            : translate('image_text_selection.generate_recipe')
        }
        onPress={handleAdd}
      />
      {/*{currentSelection && (*/}
      {/*  <MenuView*/}
      {/*    actions={[*/}
      {/*      {*/}
      {/*        id: 'remove',*/}
      {/*        title: translate('image_text_selection.remove'),*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*    onPressAction={({ nativeEvent }) => {*/}
      {/*      const event = nativeEvent?.event;*/}
      {/*      if (!event) return;*/}
      {/*      onRemoveSelected(currentSelection);*/}
      {/*    }}*/}
      {/*    style={styles.editButton}*/}
      {/*  >*/}
      {/*    <Icon name={'pencil'} color={theme.colors.primary} size={20} />*/}
      {/*  </MenuView>*/}
      {/*)}*/}
    </View>
  );
};

export default ChooseFieldFooter;
