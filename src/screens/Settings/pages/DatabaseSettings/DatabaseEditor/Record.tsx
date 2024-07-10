import Typography from '@/components/Typography';
import * as React from 'react';
import SwipeableView from '@/components/SwipeableView';
import { useStyles } from 'react-native-unistyles';
import stylesheet from './databaseEditor.styles';
import { FlatList, View } from 'react-native';
import { useCallback, useMemo } from 'react';

interface Props {
  tableName: string;
  record: Record<string, string>;
  onDelete: () => void;
}

const Record = ({ tableName, record, onDelete }: Props) => {
  console.log('how many times is this called?');
  const { styles } = useStyles(stylesheet);

  const recordArray = useMemo(() => Object.entries(record), [record]);

  const renderItem = useCallback(
    ({ item: [key, value] }: { item: [string, string] }) => (
      <View
        key={tableName + key + value}
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Typography variant={'bodyMedium'} style={styles.tableKey}>
          {`${key}: `}
        </Typography>
        <Typography variant={'bodyMediumItalic'} style={styles.tableValue}>
          {value}
        </Typography>
      </View>
    ),
    [styles.tableKey, styles.tableValue, tableName]
  );

  return (
    <SwipeableView style={styles.recordContainer} onSwipeRight={onDelete}>
      <FlatList
        // estimatedItemSize={150}
        data={recordArray}
        renderItem={renderItem}
        keyExtractor={([key, value]) => tableName + key + value}
      />
    </SwipeableView>
  );
};

export default Record;
