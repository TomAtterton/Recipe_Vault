import { SQLiteDatabase, SQLiteOpenOptions } from 'expo-sqlite/next';
import { openDatabaseAsync } from 'expo-sqlite/next';

let databaseInstance: {
  databaseName: string;
  options?: SQLiteOpenOptions;
  onInit?: (database: SQLiteDatabase) => Promise<void>;
  promise: Promise<SQLiteDatabase>;
} | null = null;

export function getDatabaseAsync({
  databaseName,
  options,
  onInit,
}: {
  databaseName: string;
  options?: SQLiteOpenOptions;
  onInit?: (database: SQLiteDatabase) => Promise<void>;
}) {
  if (
    databaseInstance?.promise != null &&
    databaseInstance?.databaseName === databaseName &&
    databaseInstance?.options === options &&
    databaseInstance?.onInit === onInit
  ) {
    return databaseInstance.promise;
  }
  let promise;
  if (databaseInstance?.promise != null) {
    promise = databaseInstance.promise
      .then((db) => {
        db.closeAsync();
      })
      .then(() => {
        return openDatabaseWithInitAsync({ databaseName, options, onInit });
      });
  } else {
    promise = openDatabaseWithInitAsync({ databaseName, options, onInit });
  }
  databaseInstance = {
    databaseName,
    options,
    onInit,
    promise,
  };
  return promise;
}

async function openDatabaseWithInitAsync({
  databaseName,
  options,
  onInit,
}: {
  databaseName: string;
  options?: SQLiteOpenOptions;
  onInit?: (database: SQLiteDatabase) => Promise<void>;
}) {
  const database = await openDatabaseAsync(databaseName, options);

  if (onInit != null) {
    await onInit(database);
  }
  return database;
}
