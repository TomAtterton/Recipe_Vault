import { View } from 'react-native';
import React from 'react';

import { ChipItemType } from '@/components/inputs/ChipInput/ChipInput';
import { stylesheet } from '@/components/inputs/ChipInput/chipInput.style';
import { useStyles } from 'react-native-unistyles';
import CheckBox from '@/components/CheckBox';
import IconButton from '@/components/buttons/IconButton';
import Typography from '@/components/Typography';

interface ChipItemProps {
  item: ChipItemType;
  hideSelection?: boolean;
  selectedItems?: ChipItemType[];
  onSelectItem?: (item: ChipItemType) => void;
  onDeleteItem: (item: ChipItemType) => void;
}

const ChipItem: React.FC<ChipItemProps> = ({
  item,
  selectedItems,
  hideSelection,
  onSelectItem,
  onDeleteItem,
}) => {
  const isSelected = selectedItems?.some((selectedItem) => selectedItem.id === item.id) || false;

  const handleSelect = () => onSelectItem && onSelectItem(item);
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.selectItemContainer}>
      {hideSelection ? (
        <Typography variant={'titleMedium'}>{item?.name}</Typography>
      ) : (
        !!item?.name && (
          <CheckBox label={item?.name} isSelected={isSelected} onPress={handleSelect} />
        )
      )}
      <IconButton iconSource={'bin'} onPress={() => onDeleteItem(item)} />
    </View>
  );
};
export default ChipItem;
