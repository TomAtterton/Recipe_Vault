import { FlatList, View } from 'react-native';
import CheckBox from '@/components/CheckBox';
import OutlineButton from '@/components/buttons/OutlineButton';
import React, { useCallback, useEffect, useState } from 'react';
import { Reminder } from 'expo-calendar';
import { getAllReminders } from '@/utils/reminderUtils';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './selectGroceryList.style';
import { setGroceryId, useBoundStore } from '@/store';
import Typography from '@/components/Typography';
import { openURL } from 'expo-linking';

const SelectGroceryList = ({ onSave }: { onSave: () => void }) => {
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);
  const groceryListId = useBoundStore((state) => state.groceryId);
  const [selectedGroceryId, setSelectedReminder] = useState<string | null | undefined>(
    groceryListId
  );

  useEffect(() => {
    const fetch = async () => {
      const reminders = await getAllReminders();
      setAllReminders(reminders || []);
    };
    fetch();
  }, []);

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
    onSave();
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        data={allReminders}
        renderItem={handleRenderItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Typography variant={'titleMedium'}>No available reminder lists</Typography>
            <OutlineButton
              title={'Create a new list'}
              onPress={() => openURL('x-apple-reminderkit://')}
            />
          </View>
        )}
      />
      <OutlineButton
        title={'save'}
        onPress={handleSave}
        disabled={!selectedGroceryId}
        style={styles.button}
      />
    </View>
  );
};

export default SelectGroceryList;
