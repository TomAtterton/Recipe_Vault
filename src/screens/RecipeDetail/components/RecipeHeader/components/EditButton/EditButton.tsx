import { MenuView } from '@react-native-menu/menu';
import React, { useCallback } from 'react';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { RecipeDetailType } from '@/types';
import NavBarButton from '@/components/buttons/NavBarButton';

interface Props {
  id?: string;
  debouncedUpdateRecipe?: (data?: Partial<RecipeDetailType>) => void;
}

const EditButton = ({ id }: Props) => {
  const navigation = useNavigation();

  const onEdit = useCallback(() => {
    id && navigation.navigate(Routes.EditRecipe, { id });
  }, [navigation, id]);
  return (
    <MenuView
      actions={[
        {
          id: 'edit',
          title: 'Edit',
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        const event = nativeEvent?.event;
        if (!event) return;
        if (event === 'edit') {
          onEdit();
        }
      }}
    >
      <NavBarButton iconSource={'more'} />
    </MenuView>
  );
};

export default EditButton;
