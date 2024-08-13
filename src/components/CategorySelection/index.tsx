import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import useCategories from '@/database/api/categories/useCategories';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import OutlineButton from '@/components/buttons/OutlineButton';

interface Props {
  selectedCategories: string[];
  onSetCategories: (categories: string[]) => void;
}

const CategorySelection = ({ selectedCategories, onSetCategories }: Props) => {
  const { data: categoryData } = useCategories();

  return (
    <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>
      {categoryData?.map((category) => {
        const isSelected = selectedCategories.includes(category?.id);
        const handlePress = () => {
          if (selectedCategories.includes(category?.id)) {
            return onSetCategories(
              selectedCategories.filter((item: string) => item !== category.id)
            );
          }
          return onSetCategories([...selectedCategories, category.id]);
        };
        return isSelected ? (
          <PrimaryButton
            title={category.name}
            key={`category-${category.id}`}
            style={styles.button}
            contentContainerStyle={{ width: undefined }}
            onPress={handlePress}
          />
        ) : (
          <OutlineButton
            key={`category-${category.id}`}
            style={styles.button}
            onPress={handlePress}
            title={category.name}
          />
        );
      })}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: 2,
    marginLeft: 12,
  },
  button: {
    marginRight: 12,
  },
});

export default CategorySelection;
