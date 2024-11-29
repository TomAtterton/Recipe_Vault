import { useEffect } from 'react';
import { checkIfPremium } from '@/services/pro/index';
import { useBoundStore } from '@/store';

const useHasPremium = () => {
  // const [hasPremium, setHasPremium] = useState<boolean>(false);
  const hasPremium = useBoundStore((state) => state.hasPremium);
  const setHasPremium = useBoundStore((state) => state.setHasPremium);

  useEffect(() => {
    checkIfPremium().then((result) => {
      setHasPremium(result);
    });
  }, [setHasPremium]);

  return hasPremium;
};

export default useHasPremium;
