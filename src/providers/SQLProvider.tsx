import { SQLiteDatabase, SQLiteOpenOptions } from 'expo-sqlite/next';
import React, { Suspense, useEffect } from 'react';
import { use } from '@/providers/helpers';
import { getDatabaseAsync } from '@/providers/SQLiteProviderSuspense';
import { initDatabase } from '@/database/sql/initDatabase';
import { ActivityIndicator, View } from 'react-native';
import { Env } from '@/core/env';
import { setDatabase } from '@/database';

const SQLiteProviderSuspense = ({
  databaseName,
  options,
  children,
  onInit,
}: {
  databaseName: string;
  options?: SQLiteOpenOptions;
  children: React.ReactNode;
  onInit?: (database: SQLiteDatabase) => Promise<void>;
}) => {
  const databasePromise = getDatabaseAsync({
    databaseName,
    options,
    onInit,
  });

  const database = use(databasePromise);

  useEffect(() => {
    setDatabase(database);
  }, [database]);

  return <>{children}</>;
};

const SQLProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <View>
          <ActivityIndicator
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            size="large"
          />
        </View>
      }
    >
      <SQLiteProviderSuspense
        databaseName={Env.SQLITE_DB_NAME}
        onInit={initDatabase}
        options={{
          enableChangeListener: true,
        }}
      >
        {children}
      </SQLiteProviderSuspense>
    </Suspense>
  );
};

export default SQLProvider;
