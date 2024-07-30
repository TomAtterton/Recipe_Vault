import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import useGroceryList from './useGroceryList';
import { Reminder } from 'expo-calendar';
import { RefreshControl } from 'react-native-gesture-handler';
import GroceryItem from 'src/screens/Groceries/components/GroceryItem';
import { stylesheet } from './groceries.style';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AddButton from '@/components/buttons/AddButton';
import { useStyles } from 'react-native-unistyles';
import { BlurView } from 'expo-blur';
import SelectGroceryList from '@/screens/Groceries/components/SelectGroceryList';
import { useBoundStore } from '@/store';
import Typography from '@/components/Typography';
import Icon from '@/components/Icon';
import { useScrollToTop } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBarButton from '@/components/buttons/NavBarButton';
import BottomSheet from '@/components/BottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import OutlineButton from '@/components/buttons/OutlineButton';
import Shimmer from '@/components/Shimmer';
import { requestReminderPermission } from '@/utils/reminderUtils';
import { useFloatingInput } from '@/providers/FloatingInputProvider';

const keyExtractor = (item: Reminder, index: number) => `${item?.id}` + index;

const mockReminder: Reminder = {
  id: '',
  title: '',
};

const loadingArray: Reminder[] = Array.from({ length: 8 }, () => mockReminder);

const Groceries = () => {
  const { showInput } = useFloatingInput();

  const { data, onAdd, onEdit, onRefresh, onCompleted, isLoading } = useGroceryList();
  const groceryListId = useBoundStore((state) => state.groceryId);
  const scrollViewRef = useRef(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const tabBarHeight = useBottomTabBarHeight();
  const { styles, theme } = useStyles(stylesheet);

  const paddingBottom = tabBarHeight;

  const handleShowGrocerySelection = () => {
    bottomSheetRef.current?.present();
  };

  useScrollToTop(scrollViewRef);
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const listData = useMemo(() => (isLoading ? loadingArray : data), [data, isLoading]);

  useEffect(() => {
    requestReminderPermission();
  }, []);

  const handleEdit = useCallback(
    (item: Reminder) => {
      showInput &&
        showInput({
          placeholder: 'Edit Grocery',
          initialValue: item?.title,
          onSubmit: (title) => {
            const trimmedTitle = title.trim();
            onEdit({ ...item, title: trimmedTitle });
          },
          onRemove: () => onEdit(item, true),
        });
    },
    [onEdit, showInput]
  );

  const handleAdd = () => {
    showInput &&
      showInput({
        placeholder: 'Add Grocery',
        initialValue: '',
        onSubmit: (title) => {
          onAdd(title);
        },
      });
  };

  const handleEmptyComponent = useCallback(() => {
    return (
      <View style={[styles.emptyContainer]}>
        <Icon name={'shopping-cart'} size={40} color={theme.colors.onBackground} />
        <Typography variant={'titleMedium'} style={styles.emptyTitle}>
          No Groceries make sure to add some groceries to your list or choose a different list.
        </Typography>
        <OutlineButton title={'Choose Grocery List'} onPress={handleShowGrocerySelection} />
      </View>
    );
  }, [styles.emptyContainer, styles.emptyTitle, theme.colors.onBackground]);

  const handleReminderItem = useCallback(
    ({ item }: { item: Reminder }) => {
      if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <Shimmer style={{ borderRadius: 10 }} width={44} height={44} />
            <Shimmer style={{ borderRadius: 10 }} width={width / 1.4} height={48} />
          </View>
        );
      }
      return <GroceryItem item={item} onCompleted={onCompleted} onEdit={handleEdit} />;
    },
    [isLoading, onCompleted, handleEdit, styles.loadingContainer, width]
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
        },
      ]}
    >
      <NavBarButton
        iconSource={'settings'}
        onPress={handleShowGrocerySelection}
        style={styles.navButton}
      />
      <View style={styles.contentContainer}>
        <FlatList
          ref={scrollViewRef}
          keyboardDismissMode={'on-drag'}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          renderItem={handleReminderItem}
          contentContainerStyle={[
            styles.listContentContainer,
            {
              paddingBottom: paddingBottom + 60,
            },
          ]}
          data={listData}
          ListEmptyComponent={handleEmptyComponent}
          refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
        />
      </View>

      {groceryListId && (
        <BlurView
          tint="dark"
          style={[
            styles.blurView,
            {
              bottom: paddingBottom,
            },
          ]}
        >
          <AddButton style={styles.addButton} title={'Add Grocery'} onPress={handleAdd} />
        </BlurView>
      )}
      <BottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPoints={['80%']}
        title={'Choose which reminders list you would like to link with'}
      >
        <SelectGroceryList onClose={() => bottomSheetRef.current?.dismiss()} />
      </BottomSheet>
    </View>
  );
};

export default Groceries;
