import { useEffect, useState } from 'react';
import { useBoundStore } from '@/store';
import { SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import * as React from 'react';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { getProfileGroupsWithId } from '@/services/profileGroup';
import { translate } from '@/core';

type User = {
  id?: string | null;
  name?: string | null;
  groupName?: string | null;
  groupRole?: string | null;
};

const ManageGroupUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState<string>('');

  const userId = useBoundStore((state) => state.session?.user.id);
  const groupId = useBoundStore((state) => state.profile.groupId);
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();
  useEffect(() => {
    getProfileGroupsWithId({ groupId }).then((_) => {
      setGroupName(_.groupName);
      setUsers(_.data);
    });
  }, [groupId, userId]);

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.container}>
        <Typography variant={'titleItalicLarge'}>
          {translate('manage_group_users.title')}
        </Typography>
        <Typography
          style={styles.title}
          variant={'titleMedium'}
        >{`${translate('manage_group_users.vault_title')}${groupName}`}</Typography>
        <View>
          {users?.map((user) => (
            <View key={user.id} style={styles.item}>
              <Typography>{user.name}</Typography>
              <Typography>{user.groupRole}</Typography>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingBottom: 20,
  },
  title: {
    paddingTop: 20,
    color: theme.colors.primary,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 8,
  },
}));

export default ManageGroupUsers;
