import React from 'react';
import { controlNameType, DraggableListItem } from '@/utils/recipeFormUtil';
import { onConvertIngredientInstructionToText } from '@/screens/ScanImageContent/scanImageUtil';
import IconButton from '@/components/buttons/IconButton';

interface Props {
  onScanLiveText?: (name: controlNameType, value: string) => void;
  name: controlNameType;
  itemState: DraggableListItem[];
}

const ScanButton = ({ onScanLiveText, name, itemState }: Props) =>
  onScanLiveText && (
    <IconButton
      iconSource={'camera'}
      onPress={() => onScanLiveText(name, onConvertIngredientInstructionToText(itemState))}
    />
  );

export default ScanButton;
