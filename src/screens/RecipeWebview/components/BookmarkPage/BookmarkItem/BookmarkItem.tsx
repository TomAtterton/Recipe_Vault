import SwipeableView from 'src/components/SwipeableView';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { StyleProp, View, ViewStyle } from 'react-native';
import React from 'react';
import { stylesheet } from './bookmarkItem.style';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { IconName } from '@/components/Icon/types';
import Icon from '@/components/Icon';

interface Props {
  style?: StyleProp<ViewStyle>;
  title: string;
  value: string;
  icon: IconName;
  onPress: () => void;
  onDelete?: () => void;
  onMore?: () => void;
}

const BookmarkItem = ({ icon, title, value, onPress, onDelete, onMore }: Props) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);
  return (
    <SwipeableView onSwipeRight={onDelete} onSwipeLeft={onMore}>
      <TouchableHighlight onPress={onPress}>
        <View style={styles.container}>
          <Icon name={icon} size={32} color={colors.primary} />
          <View style={styles.contentContainer}>
            <Typography variant={'titleLarge'} style={styles.title} numberOfLines={1}>
              {title}
            </Typography>
            <Typography variant={'bodySmall'} style={styles.description} numberOfLines={1}>
              {value}
            </Typography>
          </View>
        </View>
      </TouchableHighlight>
    </SwipeableView>
  );
};

export default BookmarkItem;
