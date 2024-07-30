import { useCallback } from 'react';
import { useFloatingInput } from '@/providers/FloatingInputProvider';

const useEditFloatingInput = () => {
  const { showInput } = useFloatingInput();

  const handleEdit = useCallback(
    (
      value: string,
      callbackEdit?: (value: string) => void,
      callbackRemove?: () => void,
      callbackDismiss?: () => void
    ) => {
      showInput &&
        showInput({
          placeholder: 'Edit',
          initialValue: value,
          multiline: true,
          onSubmit: (title) => {
            callbackEdit && callbackEdit(title);
          },
          onRemove: () => {
            callbackRemove && callbackRemove();
          },
          onDismiss: () => {
            callbackDismiss && callbackDismiss();
          },
        });
    },
    [showInput]
  );

  return {
    handleEdit,
  };
};

export default useEditFloatingInput;
