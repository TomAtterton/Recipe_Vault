import { FlatList } from 'react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { database } from '@/database';
import Table from '@/screens/Settings/pages/DatabaseSettings/DatabaseEditor/Table';
import { useStyles } from 'react-native-unistyles';
import stylesheet from './databaseEditor.styles';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';

const DatabaseEditor = () => {
  const [databaseValues, setDatabaseValues] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const tables = await database?.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
      );

      if (!tables) {
        return;
      }

      let data = [];
      for (let table of tables) {
        // @ts-ignore
        const tableName = table.name;
        const res = await database?.getAllAsync(`SELECT * FROM ${tableName}`);
        data.push({ [tableName]: res });
      }
      setDatabaseValues(data);
    };

    fetchData();
  }, []);
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();
  return (
    <>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={databaseValues}
        keyExtractor={(item, index) => `table-${index}`}
        renderItem={({ item: tableData }) => (
          <Table
            tableName={Object.keys(tableData)[0]}
            // @ts-ignore
            records={Object.values(tableData)[0]}
          />
        )}
      />
      <NavBarButton style={styles.navBarButton} iconSource={'arrow-left'} onPress={goBack} />
    </>
  );
};

export default DatabaseEditor;
