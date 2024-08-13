import React from 'react';
import ChipList from '@/components/ChipList';
import { BottomSheetRef } from '@/components/BottomSheet';
import useUpdateTags from '@/hooks/recipe/useUpdateTags';

interface Props {
  manageTagsRef: React.RefObject<BottomSheetRef>;
}

const ManageTagsContainer = ({ manageTagsRef }: Props) => {
  const { data: tags, onUpdateTags, onDeleteTags } = useUpdateTags();

  return (
    <ChipList
      hideSelection={true}
      chipListRef={manageTagsRef}
      data={tags}
      onDelete={onDeleteTags}
      onUpdate={onUpdateTags}
    />
  );
};

export default ManageTagsContainer;
