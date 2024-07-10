import { TouchableOpacity } from 'react-native';

import React, { useEffect } from 'react';
import Typography from '@/components/Typography';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import IconButton from '@/components/buttons/IconButton';

interface Props {
  startEditing: () => void;
  isActive: boolean;
  isSection: boolean;
  title?: string | null;
  note?: string;
  isDraggable: boolean;
  drag: () => void;
  onRemove: () => void;
}

const DraggableItem = ({
  startEditing,
  isActive,
  isSection,
  title,
  note,
  isDraggable,
  drag,
  onRemove,
}: Props) => {
  const { styles, theme } = useStyles(stylesheet);

  useEffect(() => {
    if (isSection && !title) {
      startEditing();
    }
    if (!isSection && !note) {
      startEditing();
    }
  }, [isSection, note, startEditing, title]);

  return (
    <>
      <TouchableOpacity style={styles.touchable} onPress={startEditing} disabled={isActive}>
        <Typography
          variant={isSection ? 'titleMedium' : 'bodyMedium'}
          style={{
            color: isSection ? theme.colors.primary : theme.colors.typography,
          }}
        >
          {isSection ? title : note}
        </Typography>
      </TouchableOpacity>
      {isDraggable ? (
        <IconButton
          iconSource="drag"
          style={styles.button}
          iconSize={30}
          disabled={isActive}
          onPressIn={drag}
          onLongPress={drag}
        />
      ) : (
        <IconButton iconSource="bin" style={styles.button} onPress={onRemove} />
      )}
    </>
  );
};

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  touchable: {
    flex: 1,
  },
  input: {
    flex: 1,
  },
  button: {
    height: 30,
    width: 30,
  },
}));

export default DraggableItem;
