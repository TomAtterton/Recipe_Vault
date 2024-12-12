import { useBoundStore } from '@/store';
import { useEffect } from 'react';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';
import { Env } from '@/core/env';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';

const useCheckMigratePrompt = () => {
  const hasSeenMigratePrompt = useBoundStore((state) => state.hasSeenMigrationPrompt);
  const setHasSeenMigrationPrompt = useBoundStore((state) => state.setHasSeenMigrationPrompt);
  const hasPremium = useBoundStore((state) => state.hasPremium);
  const isLoggedIn = useIsLoggedIn();
  const vaultName = useBoundStore((state) => state.profile.groupName);
  const { navigate } = useNavigation();

  useEffect(() => {
    const checkMigratePrompt = async () => {
      if (!isLoggedIn || hasSeenMigratePrompt) {
        return;
      }

      if (vaultName && vaultName === Env.SQLITE_DB_NAME) {
        setTimeout(() => {
          if (hasPremium) {
            navigate(Routes.MigrateToCloudModal, { isModal: true });
          } else {
            navigate(Routes.ProPlan);
          }
          setHasSeenMigrationPrompt(true);
        }, 1000);
      }
    };
    checkMigratePrompt();
    //   check if current database is local and that the user is logged in
  }, [
    hasPremium,
    hasSeenMigratePrompt,
    isLoggedIn,
    navigate,
    setHasSeenMigrationPrompt,
    vaultName,
  ]);
};

export default useCheckMigratePrompt;
