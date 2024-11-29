import { Share, TouchableOpacity, View } from 'react-native';
import Icon from '@/components/Icon';
import { IconName } from '@/components/Icon/types';
import Typography from '@/components/Typography';
import { Env } from '@/core/env';
import * as React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { DatabaseObject } from '@/types';

const DatabaseSettingsItem = ({
  item,
  onPress,
}: {
  item: DatabaseObject | undefined;
  onPress: (item: DatabaseObject) => void;
}) => {
  const { styles } = useStyles(stylesheet);
  const isLocalGroup = item?.id === Env.LOCAL_GROUP_ID;
  const isSharedGroup = item?.isShared;
  return (
    !!item && (
      <View style={styles.vaultItem}>
        <TouchableOpacity style={styles.vaultItemContent} onPress={() => onPress(item)}>
          <View style={styles.vaultItemLeft}>
            <Icon name={item?.icon as IconName} size={18} color="white" />
            <Typography>{item?.name}</Typography>
          </View>
          <Icon name="right" size={18} color="white" />
        </TouchableOpacity>
        {!isLocalGroup && !isSharedGroup ? (
          <TouchableOpacity
            onPress={async () => {
              await Share.share({
                title: 'Share database code with a friend',
                message: item.id || '',
              });
            }}
            style={styles.shareButton}
          >
            <Icon name="paper-plane" size={18} color="white" />
          </TouchableOpacity>
        ) : (
          // Placeholder to maintain spacing
          <View style={styles.shareButtonPlaceholder} />
        )}
      </View>
    )
  );
};

const stylesheet = createStyleSheet((theme) => ({
  vaultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  vaultItemContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderColor: theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vaultItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareButton: {
    width: 44,
    height: 44,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonPlaceholder: {
    width: 44,
    height: 44,
  },
}));

export default DatabaseSettingsItem;
