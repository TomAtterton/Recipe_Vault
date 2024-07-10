import { useCallback, useState } from 'react';

let editCallback: (value: string) => void;
let removeCallback: () => void;
let dismissCallback: () => void;

const useEditFloatingInput = () => {
  const [editText, setEditText] = useState('');
  const [shouldFocus, setShouldFocus] = useState(false);

  const handleEdit = useCallback(
    (
      value: string,
      callbackEdit?: (value: string) => void,
      callbackRemove?: () => void,
      callbackDismiss?: () => void
    ) => {
      setEditText(value);
      if (callbackEdit) {
        editCallback = callbackEdit;
      }
      if (callbackRemove) {
        removeCallback = callbackRemove;
      }
      if (callbackDismiss) {
        dismissCallback = callbackDismiss;
      }
      setShouldFocus(true);
    },
    []
  );

  const handleInputSubmit = (value: string) => {
    editCallback(value);
    setShouldFocus(false);
  };

  const handleInputDismiss = (containsValue?: boolean) => {
    if (!containsValue) {
      dismissCallback && dismissCallback();
    }
    setEditText('');
    setShouldFocus(false);
  };

  const handleInputRemove = () => {
    removeCallback && removeCallback();
    setEditText('');
    setShouldFocus(false);
  };

  return {
    handleEdit,
    editText,
    shouldFocus,
    handleInputSubmit,
    handleInputDismiss,
    handleInputRemove,
  };
};

export default useEditFloatingInput;
