import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { Alert } from 'react-native';
import React, { useCallback } from 'react';
import ChipItem from '@/components/inputs/ChipInput/ChipItem';
import ChipListHeader from '@/components/inputs/ChipInput/ChipListHeader';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/components/ChipList/chipList.style';
import { ChipItemType } from '@/components/inputs/ChipInput/ChipInput';
import { translate } from '@/core';
import { FlatList } from 'react-native-gesture-handler';

interface Props {
  chipListRef: React.RefObject<BottomSheetRef>;
  selectedItems?: ChipItemType[];
  data?: ChipItemType[] | null;
  hideSelection?: boolean;
  hideDelete?: boolean;
  onSelect?: (item: ChipItemType) => void;
  onDelete?: (item: ChipItemType) => Promise<void>;
  onUpdate: (item: ChipItemType) => Promise<void>;
}

function keyExtractor(item: ChipItemType) {
  return `select-item-${item?.id}`;
}

const ChipList = ({
  chipListRef,
  selectedItems,
  hideSelection,
  data,
  onSelect,
  onDelete,
  onUpdate,
}: Props) => {
  const { styles } = useStyles(stylesheet);
  const handleDelete =
    onDelete &&
    ((item: ChipItemType) => {
      Alert.alert(
        `Delete item`,
        `\nAre you sure you want to delete ${item.name} ?\n\n This will remove it from all recipes.`,
        [
          {
            text: translate('default.cancel'),
            style: 'cancel',
          },
          { text: translate('default.ok'), style: 'destructive', onPress: () => onDelete(item) },
        ]
      );
    });

  const renderSelectItem = useCallback(
    ({ item }: { item: ChipItemType }) => (
      <ChipItem
        hideSelection={hideSelection}
        item={item}
        selectedItems={selectedItems}
        onSelectItem={onSelect}
        onDeleteItem={handleDelete}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hideSelection, selectedItems]
  );

  const onRenderCategoryHeader = useCallback(
    () => <ChipListHeader itemsRef={chipListRef} items={data} onUpdateItem={onUpdate} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chipListRef, data]
  );

  return (
    <BottomSheet bottomSheetRef={chipListRef} snapPoints={['80%']}>
      <FlatList
        nestedScrollEnabled
        keyExtractor={keyExtractor}
        ListHeaderComponent={onRenderCategoryHeader}
        data={data}
        renderItem={renderSelectItem}
        style={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
      />
    </BottomSheet>
  );
};

export default ChipList;
