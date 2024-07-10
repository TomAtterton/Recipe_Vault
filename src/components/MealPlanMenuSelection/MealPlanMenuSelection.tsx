import React from 'react';
import { MenuView } from '@react-native-menu/menu';

interface Props {
  onPress?: (event: 'dinner' | 'breakfast' | 'lunch') => void;
  children: React.ReactNode;
}

const MealPlanMenuSelection = ({ onPress, children }: Props) => {
  return (
    <MenuView
      actions={[
        {
          id: 'breakfast',
          title: 'Breakfast',
        },
        {
          id: 'lunch',
          title: 'Lunch',
        },
        {
          id: 'dinner',
          title: 'Dinner',
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        const event = nativeEvent?.event as 'dinner' | 'breakfast' | 'lunch';
        if (!event) return;
        onPress?.(event);
      }}
    >
      {children}
    </MenuView>
  );
};

export default MealPlanMenuSelection;
