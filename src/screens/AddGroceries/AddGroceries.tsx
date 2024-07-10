import React, { useState } from 'react';
import { ScrollView, SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import CheckBoxInput from '@/components/CheckBoxInput';
import { stylesheet } from '@/screens/AddGroceries/addGroceries.style';
import { useStyles } from 'react-native-unistyles';
import { createMultipleReminders } from '@/utils/reminderUtils';
import { Routes } from '@/navigation/Routes';
import { RouteProp } from '@/navigation/types';
import LabelButton from '@/components/buttons/LabelButton';
import { showErrorMessage } from '@/utils/errorUtils';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';

type Ingredient = {
  name: string;
  isSelected: boolean;
};

const AddGroceries: React.FC = () => {
  const route = useRoute<RouteProp<Routes.AddGroceries>>();
  const params = route.params;

  const { navigate } = useNavigation();
  const initialIngredients: Ingredient[] =
    params?.ingredients?.map((ingredient) => ({
      name: ingredient,
      isSelected: true, // All ingredients are selected by default
    })) || [];

  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);

  useKeyboardForm();

  const toggleIngredientSelection = (index: number): void => {
    const newIngredients = ingredients.map((item, idx) => {
      if (idx === index) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });
    setIngredients(newIngredients);
  };

  const updateIngredientName = (index: number, newName: string): void => {
    const newIngredients = ingredients.map((item, idx) => {
      if (idx === index) {
        return { ...item, name: newName };
      }
      return item;
    });
    setIngredients(newIngredients);
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const selectedIngredients = ingredients
        .filter((ingredient) => ingredient.isSelected)
        .map((ingredient) => ({
          title: ingredient.name,
        }));

      await createMultipleReminders(selectedIngredients);
      navigate(Routes.Groceries);
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding groceries', error);
      showErrorMessage('Error adding groceries');
      setIsLoading(false);
    }
  };

  const { styles } = useStyles(stylesheet);

  return (
    <SafeAreaView style={styles.container}>
      <Typography style={styles.title} variant={'titleLarge'}>
        Add to groceries
      </Typography>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingVertical: 16,
        }}
      >
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
