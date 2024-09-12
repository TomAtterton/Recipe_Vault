import { FlatList, View, AppState } from 'react-native';
import CheckBox from '@/components/CheckBox';
import OutlineButton from '@/components/buttons/OutlineButton';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Reminder } from 'expo-calendar';
import { getAllReminders } from '@/utils/reminderUtils';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './selectGroceryList.style';
import { setGroceryId, useBoundStore } from '@/store';
import Typography from '@/components/Typography';
import { openURL } from 'expo-linking';
import { translate } from '@/core';
import AddButton from '@/components/buttons/AddButton';
import BottomSheet from '@/components/BottomSheet';
import { TrueSheet } from '@lodev09/react-native-true-sheet';

interface Props {
  onClose: () => void;
  bottomSheetRef: React.RefObject<TrueSheet>;
}

const SelectGroceryList = ({ bottomSheetRef, onClose }: Props) => {
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);
  const groceryListId = useBoundStore((state) => state.groceryId);
  const [selectedGroceryId, setSelectedReminder] = useState<string | null | undefined>(
    groceryListId,
  );

  const { styles } = useStyles(stylesheet);

  const handleSelectReminder = useCallback((id: string | undefined) => {
    setSelectedReminder(id);
  }, []);

  const handleRenderItem = useCallback(
    ({ item }: { item: Reminder }) => (
      <CheckBox
        isSelected={selectedGroceryId === item.id}
        onPress={() => handleSelectReminder(item?.id)}
        label={item.title}
      />
    ),
    [selectedGroceryId, handleSelectReminder],
  );

  const handleSave = () => {
    if (selectedGroceryId) setGroceryId(selectedGroceryId);
    onClose();
  };

  const handleOpenSettings = useCallback(async () => {
    await openURL('x-apple-reminderkit://');
  }, []);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const reminders = await getAllReminders();
        setAllReminders(reminders || []);
      }

      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const renderListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Typography variant={'titleMedium'}>{translate('select_grocery_list.no_list')}</Typography>
        <OutlineButton
          title={translate('select_grocery_list.create_new_list_button')}
          onPress={handleOpenSettings}
        />
      </View>
    ),
    [styles.emptyContainer, handleOpenSettings],
  );

  const ListFooterComponent = useMemo(
    () =>
      allReminders?.length > 0 ? (
        <AddButton
          title={translate('select_grocery_list.create_new_list_button')}
          onPress={handleOpenSettings}
        />
      ) : null,
    [allReminders, handleOpenSettings],
  );

  return (
    <BottomSheet
      bottomSheetRef={bottomSheetRef}
      snapPoints={['80%']}
      onPresent={async () => {
        try {
          const reminders = await getAllReminders();
          setAllReminders(reminders || []);
        } catch (error) {
          console.log('Error fetching reminders:', error);
        }
      }}
    >
      <View style={styles.container}>
        <Typography variant={'titleMedium'}>{translate('select_grocery_list.title')}</Typography>
        <FlatList
          keyExtractor={(item, index) => item?.id || `${index}}`}
          style={styles.list}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.listContentContainer}
          data={allReminders}
          renderItem={handleRenderItem}
          initialNumToRender={10}
          getItemLayout={(data, index) => ({
            length: 50,
            offset: 50 * index,
            index,
          })}
          ListEmptyComponent={renderListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
        />
        {allReminders?.length > 0 && (
          <OutlineButton
            title={translate('select_grocery_list.save_button')}
            onPress={handleSave}
            disabled={!selectedGroceryId}
            style={styles.button}
          />
        )}
      </View>
    </BottomSheet>
  );
};

export default SelectGroceryList;
