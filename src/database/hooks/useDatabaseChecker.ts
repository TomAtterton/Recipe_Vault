// import * as FileSystem from 'expo-file-system';
// import { useEffect } from 'react';
//
// const useDatabaseChecker = () => {
//   const checkDatabase = async () => {
//     try {
//       const dbDirectory = FileSystem.documentDirectory + 'SQLite';
//       const { exists: dirExists } = await FileSystem.getInfoAsync(dbDirectory);
//
//       if (!dirExists) {
//         console.log('No SQLite directory found');
//         return;
//       }
//
//       const directoryContent = await FileSystem.readDirectoryAsync(dbDirectory);
//       const databases = directoryContent.filter((file) => file.endsWith('.db'));
//
//       console.log('Found databases:', databases);
//
//       // Log details for each database
//       for (const db of databases) {
//         const dbInfo = await FileSystem.getInfoAsync(dbDirectory + '/' + db, { size: true });
//         console.log(`Database: ${db}`, dbInfo);
//       }
//     } catch (error) {
//       console.error('Error checking databases:', error);
//     }
//   };
//
//   useEffect(() => {
//     checkDatabase();
//   }, [checkDatabase]);
//
//   // return {
//   //   checkDatabase,
//   // };
// };
//
// export default useDatabaseChecker;
