import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';

export type ScanImageSlice = {
  scannedImage?: string | null;
  setScannedImage: (scannedImage?: string | null) => void;
};

const initialScanImageState = {
  scannedImage: null,
};
export const createScanImageSlice: StateCreator<ScanImageSlice, [], [], ScanImageSlice> = (set) => {
  sliceResetFns.add(() => set(initialScanImageState));
  return {
    ...initialScanImageState,
    setScannedImage: (scannedImage) => set({ scannedImage }),
  };
};
