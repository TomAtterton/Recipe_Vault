import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DraggableListItem } from '@/utils/recipeFormUtil';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { stylesheet } from './item.style';
import IconButton from '@/components/buttons/IconButton';
import { RenderItemParams } from '@/components/DraggableFlatList';

const Item = ({
  item: { id, type, title: sectionTitle, text: value },
  drag,
  isActive,
  onEdit,
  getIndex,
}: RenderItemParams<DraggableListItem> & {
  onEdit: (item: DraggableListItem, index: number | undefined) => void;
}) => {
  const isSection = useMemo(() => type === 'section', [type]);
  const { styles, theme } = useStyles(stylesheet);

  const handleEdit = () => {
    onEdit({ id, type, title: sectionTitle, text: value }, getIndex());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.contentContainer} onPress={handleEdit} disabled={isActive}>
        <Typography
          variant={isSection ? 'titleMedium' : 'bodyMedium'}
          style={{
            color: isSection ? theme.colors.primary : theme.colors.typography,
          }}
        >
          {isSection ? sectionTitle : value}
        </Typography>
      </TouchableOpacity>
      <IconButton
        iconSource="drag"
        style={styles.button}
        iconSize={30}
        disabled={isActive}
        onPressIn={drag}
        onLongPress={drag}
      />
    </View>
  );
};

export default Item;
