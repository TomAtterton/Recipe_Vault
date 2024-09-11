import React from 'react';
import { ScrollView, View } from 'react-native';
import Typography from '@/components/Typography';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import CheckBoxInput from '@/components/CheckBoxInput';
import { stylesheet } from '@/screens/AddGroceries/addGroceries.style';
import { useStyles } from 'react-native-unistyles';
import LabelButton from '@/components/buttons/LabelButton';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import useAddGroceries from '@/screens/AddGroceries/useAddGroceries';
import { translate } from '@/core';

const AddGroceries = () => {
  useKeyboardForm();

  const { styles } = useStyles(stylesheet);

  const {
    toggleIngredientSelection,
    updateIngredientName,
    ingredients,
    setIngredients,
    handleSave,
    isLoading,
  } = useAddGroceries();
  return (
    <View style={styles.container}>
      <Typography style={styles.title} variant={'titleLarge'}>
        {translate('add_groceries.title')}
      </Typography>
      <View style={styles.selectContainer}>
        <LabelButton
          title={translate('add_groceries.select_all')}
          onPress={() =>
            setIngredients(
              ingredients.map((ingredient) => ({
                ...ingredient,
                isSelected: true,
              })),
            )
          }
        />
        <LabelButton
          title={translate('add_groceries.deselect_all')}
          onPress={() =>
            setIngredients(
              ingredients.map((ingredient) => ({
                ...ingredient,
                isSelected: false,
              })),
            )
          }
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {ingredients.map((ingredient, index) => (
          <CheckBoxInput
            key={index}
            isSelected={ingredient.isSelected}
            multiline={true}
            onPress={() => toggleIngredientSelection(index)}
            label={ingredient.name}
            onChangeText={(newName) => updateIngredientName(index, newName)}
          />
        ))}
      </ScrollView>
      <PrimaryButton
        isLoading={isLoading}
        style={styles.button}
        title={translate('add_groceries.save_button')}
        onPress={handleSave}
      />
    </View>
  );
};

export default AddGroceries;
