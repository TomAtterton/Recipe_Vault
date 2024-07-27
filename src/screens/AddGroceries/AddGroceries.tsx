import React from 'react';
import { ScrollView, SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import CheckBoxInput from '@/components/CheckBoxInput';
import { stylesheet } from '@/screens/AddGroceries/addGroceries.style';
import { useStyles } from 'react-native-unistyles';
import LabelButton from '@/components/buttons/LabelButton';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import useAddGroceries from '@/screens/AddGroceries/useAddGroceries';

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
    <SafeAreaView style={styles.container}>
      <Typography style={styles.title} variant={'titleLarge'}>
        Add to groceries
      </Typography>
      <View style={styles.selectContainer}>
        <LabelButton
          title={'Select All /'}
          onPress={() =>
            setIngredients(
              ingredients.map((ingredient) => ({
                ...ingredient,
                isSelected: true,
              }))
            )
          }
        />
        <LabelButton
          title={' Deselect All'}
          onPress={() =>
            setIngredients(
              ingredients.map((ingredient) => ({
                ...ingredient,
                isSelected: false,
              }))
            )
          }
        />
      </View>

      <ScrollView
        style={styles.scrollview}
        contentContainerStyle={styles.scrollviewContent}
        showsVerticalScrollIndicator={false}
      >
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
        title={'Save'}
        onPress={handleSave}
      />
    </SafeAreaView>
  );
};

export default AddGroceries;
