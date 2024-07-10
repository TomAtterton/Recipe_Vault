import { FlatList, TouchableOpacity, View } from 'react-native';
import Typography from '@/components/Typography';
import * as React from 'react';
import Record from '@/screens/Settings/pages/DatabaseSettings/DatabaseEditor/Record';
import { useCallback, useState } from 'react';
import { Collapsible } from 'react-native-fast-collapsible';
import stylesheet from './databaseEditor.styles';
import { useStyles } from 'react-native-unistyles';
import Icon from '@/components/Icon';

interface Props {
  tableName: string;
  records: Record<string, string>[];
}

const Table = ({ tableName, records }: Props) => {
  const [isVisible, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility((previous) => !previous);
  };

  const {
    theme: { colors },
    styles,
  } = useStyles(stylesheet);

  const renderItem = useCallback(
    ({ item: record, index }: { item: Record<string, string>; index: number }) => (
      <Record
        key={tableName + index}
        tableName={tableName}
        record={record}
        onDelete={() => console.log(`Delete record ${index}`)}
      />
    ),
    [tableName]
  );
  console.log('tableName', tableName);
  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity style={styles.tableHeader} onPress={toggleVisibility}>
        <Typography variant={'titleLarge'} style={styles.tableTitle}>
          {tableName}
        </Typography>
        <Icon name={isVisible ? 'arrow-up' : 'arrow-down'} size={20} color={colors.primary} />
      </TouchableOpacity>
      <Collapsible isVisible={isVisible}>
        <FlatList
          // estimatedItemSize={75}
          data={records}
          renderItem={renderItem}
          keyExtractor={(item, index) => tableName + index}
        />
      </Collapsible>
    </View>
  );
};

export default Table;
