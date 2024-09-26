import React from 'react';
import { controlNameType, DraggableListItem } from '@/utils/recipeFormUtil';
import IconButton from '@/components/buttons/IconButton';
import { onConvertIngredientInstructionToText } from '@/screens/RecipeTextInputContainer/recipeFormUtil';

interface Props {
  onScanLiveText?: (name: controlNameType, value: string) => void;
  name: controlNameType;
  itemState: DraggableListItem[];
}

const ScanButton = ({ onScanLiveText, name, itemState }: Props) =>
  onScanLiveText && (
    <IconButton
      iconSource={'pencil-add'}
      onPress={() => onScanLiveText(name, onConvertIngredientInstructionToText(itemState))}
    />
  );

export default ScanButton;
