import { useState } from 'react';
import { addHistory } from '@/store';

const useHandleBookmark = (uri: string, setUri: (value: string) => void) => {
  const [showBookmark, setShowBookmark] = useState(false);

  const handleLinkPress = (item: string) => {
    setShowBookmark(false);
    setUri(item);
    addHistory({ name: item, url: item });
  };

  const [bookmarkInput, setBookmarkInput] = useState<{
    id?: string;
    name?: string;
    uri: string;
  } | null>(null);

  const handleShowBookmarkModal = ({ id, name }: { id?: string; name?: string }) => {
    setBookmarkInput({ id, name, uri });
  };

  return {
    showBookmark,
    handleLinkPress,
    handleShowBookmarkModal,
    setBookmarkInput,
    bookmarkInput,
    setShowBookmark,
  };
};

export default useHandleBookmark;
