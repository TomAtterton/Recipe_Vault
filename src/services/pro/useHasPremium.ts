import { useEffect, useState } from 'react';
import { checkIfPremium } from '@/services/pro/index';

const useHasPremium = () => {
  const [hasPremium, setHasPremium] = useState<boolean>(false);

  useEffect(() => {
    checkIfPremium().then((result) => {
      setHasPremium(result);
    });
  }, []);

  return hasPremium;
};

export default useHasPremium;
