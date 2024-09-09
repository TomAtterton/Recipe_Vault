import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteAllHistory, deleteBookmark, deleteHistory, useBoundStore } from '@/store';
import { SEARCH_BAR_HEIGHT, stylesheet } from './bookmarkPage.style';
import { FlashList } from '@shopify/flash-list';
import BookmarkItem from '@/screens/RecipeWebview/components/BookmarkPage/BookmarkItem/BookmarkItem';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { translate } from '@/core';

interface Props {
  showBookmark: boolean;
  onLinkPress: (item: string) => void;
  onShowBookmarkModal: (item: { id?: string; name?: string }) => void;
}

type BookmarkItemType = {
  id: string;
  name: string;
  url: string;
};

const keyExtractor = (item: string | BookmarkItemType) =>
  typeof item === 'string' ? item : item?.id;

const BookmarkPage = ({ showBookmark, onLinkPress, onShowBookmarkModal }: Props) => {
  const { styles } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const bookmarkData = useBoundStore((state) => state.bookmarks);
  const historyData = useBoundStore((state) => state.history);

  const sectionData = useMemo(() => {
    const bookmarks =
      bookmarkData.length > 0 ? [translate('bookmark.bookmarks'), ...bookmarkData] : [];
    const history = historyData.length > 0 ? [translate('bookmark.history'), ...historyData] : [];

    return [...bookmarks, ...history];
  }, [bookmarkData, historyData]);
  const handleRenderItem = useCallback(
    ({ item, index }: { item: string | BookmarkItemType; index: number }) => {
      const isBookmark = item === translate('bookmark.bookmarks');

      if (typeof item === 'string') {
        return (
          <View style={styles.titleContainer}>
            <Typography variant={'titleLarge'} style={styles.bookmarkTitle}>
              {item}
            </Typography>
            {!isBookmark && (
              <TouchableOpacity style={styles.deleteAllHistoryButton} onPress={deleteAllHistory}>
                <Typography variant={'bodySmall'} style={styles.clearTitle}>
                  {isBookmark
                    ? translate('bookmark.clear_bookmarks')
                    : translate('bookmark.clear_history')}
                </Typography>
              </TouchableOpacity>
            )}
          </View>
        );
      }

      const isHistorySectionItem = bookmarkData.length > 0 ? index > bookmarkData.length + 1 : true;

      const handleMorePress = !isHistorySectionItem
        ? () => onShowBookmarkModal({ id: item.id, name: item.name })
        : undefined;

      return (
        <BookmarkItem
          title={item.name}
          value={item.url}
          icon={isHistorySectionItem ? 'reload-time' : 'bookmark-outline'}
          onMore={handleMorePress}
          onPress={() => onLinkPress(item.url)}
          onDelete={() => {
            if (isHistorySectionItem) {
              deleteHistory({ id: item.id });
            } else {
              deleteBookmark({ id: item.id });
            }
          }}
        />
      );
    },
    [
      bookmarkData.length,
      onLinkPress,
      onShowBookmarkModal,
      styles.bookmarkTitle,
      styles.clearTitle,
      styles.deleteAllHistoryButton,
      styles.titleContainer,
    ],
  );

  const translateY = useSharedValue(height - top - SEARCH_BAR_HEIGHT);

  useEffect(() => {
    if (showBookmark) {
      translateY.value = 0;
    } else {
      translateY.value = height - top - SEARCH_BAR_HEIGHT;
    }
  }, [height, showBookmark, top, translateY]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 200,
          }),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: top + SEARCH_BAR_HEIGHT,
        },
        animatedStyles,
      ]}
    >
      <FlashList
        keyExtractor={keyExtractor}
        estimatedItemSize={64}
        keyboardShouldPersistTaps={'handled'}
        data={sectionData}
        keyboardDismissMode={'on-drag'}
        // extraData={history.length}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === 'string' ? 'sectionHeader' : 'row';
        }}
        renderItem={handleRenderItem}
      />
    </Animated.View>
  );
};

export default BookmarkPage;
