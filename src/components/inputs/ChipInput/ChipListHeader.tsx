import { View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { ChipItemType } from '@/components/inputs/ChipInput/ChipInput';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/components/inputs/ChipInput/chipInput.style';
import AddButton from '@/components/buttons/AddButton';
import FormInput from '@/components/inputs/FormInput';
import LabelButton from '@/components/buttons/LabelButton';
import { translate } from '@/core';
import { showErrorMessage } from '@/utils/promptUtils';
import { BottomSheetRef } from '@/components/BottomSheet';

const ChipListHeader = ({
  items,
  onUpdateItem,
  itemsRef,
}: {
  items?: ChipItemType[] | null;
  onUpdateItem: (item: ChipItemType) => Promise<void>;
  itemsRef: React.RefObject<BottomSheetRef>;
}) => {
  const [newItem, setNewItem] = useState('');
  const [showAddItemInput, setShowAddItemInput] = useState(false);
  const { styles } = useStyles(stylesheet);

  const handleAddNewItem = useCallback(() => {
    setShowAddItemInput(true);
  }, []);

  const handleCancelNewItem = useCallback(() => {
    setShowAddItemInput(false);
    setNewItem('');
  }, []);

  const handleSaveNewItem = useCallback(async () => {
    setShowAddItemInput(false);

    const trimmedNewItem = newItem.trim();

    if (trimmedNewItem.length === 0) {
      setNewItem('');
      return;
    }

    const lowerCaseExistingItems = new Set(items?.map((item) => item?.name?.toLowerCase()));

    const lowerCaseNewItem = trimmedNewItem.toLowerCase();

    const itemExists = lowerCaseExistingItems.has(lowerCaseNewItem);

    if (itemExists) {
      setNewItem('');
      showErrorMessage(translate('chip_list_header.item_exists'));
      return;
    }

    await onUpdateItem({
      id: Math.random().toString(),
      name: newItem,
    });
    itemsRef.current?.present();
    setNewItem('');
  }, [newItem, onUpdateItem, itemsRef, items]);

  return (
    <View style={styles.listHeaderContainer}>
      {!showAddItemInput ? (
        <AddButton title={translate('chip_list_header.add_new_item')} onPress={handleAddNewItem} />
      ) : (
        <>
          <FormInput
            onBlur={handleSaveNewItem}
            autoFocus={true}
            value={newItem}
            onChange={setNewItem}
            placeholder={translate('chip_list_header.new_item_placeholder')}
            style={styles.newCategoryInput}
            onSubmitEditing={handleSaveNewItem}
          />
          <LabelButton title={translate('default.cancel')} onPress={handleCancelNewItem} />
        </>
      )}
    </View>
  );
};

export default ChipListHeader;
