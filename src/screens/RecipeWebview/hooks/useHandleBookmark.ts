import { useState } from 'react';
import { addBookmark, onEditBookmark } from '@/store';
import { useFloatingInput } from '@/providers/FloatingInputProvider';

const useHandleBookmark = (uri: string, setUri: (value: string) => void) => {
  const [showBookmark, setShowBookmark] = useState(false);

  const handleLinkPress = (item: string) => {
    setShowBookmark(false);
    setUri(item);
  };

  const { showInput } = useFloatingInput();

  const handleShowBookmarkModal = ({ id, name }: { id?: string; name?: string }) => {
    showInput &&
      showInput({
        placeholder: 'Enter bookmark name',
        description: uri || '',
        initialValue: name,
        onSubmit: (text: string) => {
          if (id) {
            onEditBookmark({
              id,
              name: text,
            });
          } else {
            uri &&
              addBookmark({
                name: text || uri,
                url: uri,
              });
          }
        },
        onDismiss: () => {
          setShowBookmark(false);
        },
      });
  };

  return {
    showBookmark,
    handleLinkPress,
    handleShowBookmarkModal,
    setShowBookmark,
  };
};

export default useHandleBookmark;
