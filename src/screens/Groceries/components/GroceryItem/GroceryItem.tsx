import { Reminder } from 'expo-calendar';
import React, { useState } from 'react';
import CheckBoxInput from '@/components/CheckBoxInput';

const GroceryItem = ({
  item,
  onEdit,
  onCompleted,
}: {
  item: Reminder;
  onEdit: (details: Reminder) => void;
  onCompleted: (details: Reminder) => void;
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleCompleted = () => {
    setIsSelected(!isSelected);
    onCompleted({ ...item, completed: !isSelected });
  };

  return (
    <CheckBoxInput
      isSelected={isSelected}
      multiline={true}
      onPressInput={() => onEdit(item)}
      onPress={handleCompleted}
      label={item?.title || ''}
    />
  );
};
export default GroceryItem;
