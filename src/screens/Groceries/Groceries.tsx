import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, useWindowDimensions, View, Linking } from 'react-native';
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
import NavBarButton from '@/components/buttons/NavBarButton';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import OutlineButton from '@/components/buttons/OutlineButton';
import Shimmer from '@/components/Shimmer';
import { requestReminderPermission } from '@/utils/reminderUtils';
import { useFloatingInput } from '@/providers/FloatingInputProvider';
import { translate } from '@/core';

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
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const infoSheetRef = useRef<BottomSheetRef>(null); // Info Bottom Sheet Ref

  const tabBarHeight = useBottomTabBarHeight();
  const { styles, theme } = useStyles(stylesheet);
  const paddingBottom = tabBarHeight;
  const { width } = useWindowDimensions();

  const listData = useMemo(() => (isLoading ? loadingArray : data), [data, isLoading]);

  useEffect(() => {
    requestReminderPermission();
  }, []);

  const handleShowGrocerySelection = () => {
    bottomSheetRef.current?.present();
  };

  const handleShowInfoSheet = () => {
    infoSheetRef.current?.present();
  };

  const handleEdit = useCallback(
    (item: Reminder) => {
      showInput &&
        showInput({
          placeholder: translate('groceries.edit_placeholder'),
          initialValue: item?.title,
          onSubmit: (title) => {
            const trimmedTitle = title.trim();
            onEdit({ ...item, title: trimmedTitle });
          },
          onRemove: () => onEdit(item, true),
        });
    },
    [onEdit, showInput],
  );

  const handleAdd = () => {
    showInput &&
      showInput({
        placeholder: translate('groceries.add_placeholder'),
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
          {translate('groceries.empty_message')}
        </Typography>
        <OutlineButton
          title={translate('groceries.choose_list_button')}
          onPress={handleShowGrocerySelection}
        />
      </View>
    );
  }, [styles.emptyContainer, styles.emptyTitle, theme.colors.onBackground]);

  const handleReminderItem = useCallback(
    ({ item }: { item: Reminder }) => {
      if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <Shimmer style={styles.shimmer} width={44} height={44} />
            <Shimmer style={styles.shimmer} width={width / 1.4} height={48} />
          </View>
        );
      }
      return <GroceryItem item={item} onCompleted={onCompleted} onEdit={handleEdit} />;
    },
    [isLoading, onCompleted, handleEdit, styles.loadingContainer, styles.shimmer, width],
  );

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.leftHeaderContent}>
          <Typography variant={'titleMedium'}>{translate('groceries.title')}</Typography>
          <NavBarButton
            iconSource={'info'}
            onPress={handleShowInfoSheet}
            style={styles.navButton}
          />
        </View>
        <NavBarButton
          iconSource={'settings'}
          onPress={handleShowGrocerySelection}
          style={styles.navButton}
        />
      </View>
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
          <AddButton
            style={styles.addButton}
            title={translate('groceries.add_button')}
            onPress={handleAdd}
          />
        </BlurView>
      )}

      <BottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['80%']}>
        <SelectGroceryList onClose={() => bottomSheetRef.current?.dismiss()} />
      </BottomSheet>

      <BottomSheet
        bottomSheetRef={infoSheetRef}
        title={translate('groceries.info_bottom_sheet.title')}
        snapPoints={['40%']}
        style={styles.infoContainer}
      >
        <Typography variant="bodyMedium" style={styles.infoDescription}>
          {translate('groceries.info_bottom_sheet.description')}
        </Typography>
        <View style={styles.infoBottomContent}>
          <OutlineButton
            title={translate('groceries.info_bottom_sheet.share')}
            onPress={() =>
              handleOpenLink('https://support.apple.com/en-qa/guide/iphone/iph2a8f9121e/ios')
            }
          />
          <OutlineButton
            title={translate('groceries.info_bottom_sheet.learn_more')}
            onPress={() =>
              handleOpenLink('https://support.apple.com/en-us/guide/reminders/welcome/mac')
            }
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default Groceries;
