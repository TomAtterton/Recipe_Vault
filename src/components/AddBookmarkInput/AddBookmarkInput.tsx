import React, { useEffect } from 'react';
import FloatingInput from '@/components/FloatingInput';
import { addBookmark, onEditBookmark } from '@/store';

interface Props {
  bookmarkInput: { id?: string; uri: string; name?: string } | null;
}

const AddBookmarkInput = ({ bookmarkInput }: Props) => {
  const [shouldFocus, setShouldFocus] = React.useState(false);

  useEffect(() => {
    if (bookmarkInput) {
      setShouldFocus(true);
    }
  }, [bookmarkInput]);

  const handleDismiss = () => {
    setShouldFocus(false);
  };

  const handleSubmit = (bookmarkName: string) => {
    const { id, name, uri } = bookmarkInput || {};
    if (id) {
      onEditBookmark({
        id,
        name: bookmarkName || name || '',
      });
    } else {
      uri &&
        addBookmark({
          name: bookmarkName || uri,
          url: uri,
        });
    }
    handleDismiss();
  };
  return (
    <FloatingInput
      onSubmit={handleSubmit}
      onDismiss={handleDismiss}
      initialValue={bookmarkInput?.name}
      description={bookmarkInput?.uri ? bookmarkInput.uri : ''}
      placeholder={'Enter bookmark name'}
      shouldFocus={shouldFocus}
    />
  );
};

export default AddBookmarkInput;
