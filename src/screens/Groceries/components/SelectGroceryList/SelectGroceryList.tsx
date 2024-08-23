import { FlatList, View, AppState } from 'react-native';
import CheckBox from '@/components/CheckBox';
import OutlineButton from '@/components/buttons/OutlineButton';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Reminder } from 'expo-calendar';
import { getAllReminders } from '@/utils/reminderUtils';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './selectGroceryList.style';
import { setGroceryId, useBoundStore } from '@/store';
import Typography from '@/components/Typography';
import { openURL } from 'expo-linking';

interface Props {
  onClose: () => void;
}

const SelectGroceryList = ({ onClose }: Props) => {
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);
  const groceryListId = useBoundStore((state) => state.groceryId);
  const [selectedGroceryId, setSelectedReminder] = useState<string | null | undefined>(
    groceryListId
  );

  const { styles } = useStyles(stylesheet);

  const handleRenderItem = useCallback(
    ({ item }: { item: Reminder }) => (
      <CheckBox
        isSelected={selectedGroceryId === item.id}
        onPress={() => setSelectedReminder(item?.id)}
        label={item.title}
      />
    ),
    [selectedGroceryId]
  );

  const handleSave = () => {
    selectedGroceryId && setGroceryId(selectedGroceryId);
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

    const fetchReminders = async () => {
      const reminders = await getAllReminders();
      setAllReminders(reminders || []);
    };
    fetchReminders();

    return () => {
      subscription.remove();
    };
  }, []);

  const renderListEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Typography variant={'titleMedium'}>No available reminder lists</Typography>
        <OutlineButton title={'Create a new list'} onPress={handleOpenSettings} />
      </View>
    );
  }, [styles.emptyContainer, handleOpenSettings]);

  return (
    <View style={styles.container}>
      <Typography variant={'titleMedium'}>
        Choose which reminders list you would like to link with
      </Typography>
      <FlatList
        style={styles.list}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.listContentContainer}
        data={allReminders}
        renderItem={handleRenderItem}
        ListEmptyComponent={renderListEmptyComponent}
      />
      {allReminders?.length > 0 && (
        <OutlineButton
          title={'save'}
          onPress={handleSave}
          disabled={!selectedGroceryId}
          style={styles.button}
        />
      )}
    </View>
  );
};
export default SelectGroceryList;
