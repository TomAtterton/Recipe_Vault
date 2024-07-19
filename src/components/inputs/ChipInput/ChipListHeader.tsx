import { View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { showMessage } from 'react-native-flash-message';
import { ChipItemType } from '@/components/inputs/ChipInput/ChipInput';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/components/inputs/ChipInput/chipInput.style';
import AddButton from '@/components/buttons/AddButton';
import FormInput from '@/components/inputs/FormInput';
import LabelButton from '@/components/buttons/LabelButton';
import { translate } from '@/core';

const ChipListHeader = ({
  items,
  onUpdateItem,
  itemsRef,
}: {
  items?: ChipItemType[] | null;
  onUpdateItem: (item: ChipItemType) => Promise<void>;
  itemsRef: React.RefObject<BottomSheetModal>; // Renamed categoriesRef to itemsRef
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

      showMessage({
        message: 'Error',
        description: 'Item already exists',
        type: 'danger',
        duration: 1000,
        icon: 'danger',
      });
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
        <AddButton title={'Add new item'} onPress={handleAddNewItem} />
      ) : (
        <>
          <FormInput
            onBlur={handleSaveNewItem}
            autoFocus={true}
            value={newItem}
            onChange={setNewItem}
            placeholder="New Item"
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
