import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Keyboard, View } from 'react-native';
import { HEIGHT } from '@/theme/constants';

interface Props {
  currentFilters: FilterObjectType;
  onUpdateFilter: (filterOptions: FilterObjectType) => void;
}

import { Tag } from '@/types';
import { FilterObjectType } from '@/utils/filterUtils';
import useGetTags from '@/database/api/tags/useGetTags';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import BottomSheet from '@/components/BottomSheet';
import CheckBox from '@/components/CheckBox';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import IconButton from '@/components/buttons/IconButton';
import LabelButton from '@/components/buttons/LabelButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import StarRating from '@/components/StarRating';
import { stylesheet } from './filterOptions.style';

export const defaultFilterOptions = () => ({
  cooked: false,
  notCooked: false,
  rating: null,
  tags: [],
});

const FilterOptions = ({ currentFilters, onUpdateFilter }: Props) => {
  const onFilter = useCallback(() => {
    setFilterOptions(currentFilters);
    Keyboard.dismiss();
    optionsRef.current?.present();
  }, [currentFilters]);

  const snapPoints = React.useMemo(() => [HEIGHT / 1.2], []);
  const optionsRef = React.useRef<BottomSheetModal>(null);

  const [filterOptions, setFilterOptions] = useState<FilterObjectType>({
    rating: currentFilters?.rating || null,
    tags: currentFilters?.tags || [],
  });

  const updateFilterOption = useCallback(
    <K extends keyof FilterObjectType>(option: K, value: FilterObjectType[K]) => {
      setFilterOptions((prevOptions) => ({
        ...prevOptions,
        [option]: value,
      }));
    },
    []
  );

  const { data } = useGetTags();

  const onRenderItem = useCallback(
    ({ item }: { item: Tag }) => {
      const isSelected = filterOptions?.tags?.includes(item.id);

      const handleSelect = () => {
        const updatedTags = isSelected
          ? filterOptions?.tags?.filter((tagId) => tagId !== item.id)
          : [...(filterOptions?.tags || []), item.id];

        updateFilterOption('tags', updatedTags);
      };

      return <CheckBox isSelected={isSelected} label={item.name || ''} onPress={handleSelect} />;
    },
    [filterOptions?.tags, updateFilterOption]
  );

  const onSaved = useCallback(() => {
    filterOptions && onUpdateFilter(filterOptions);
    optionsRef.current?.dismiss();
  }, [filterOptions, onUpdateFilter]);

  const onReset = useCallback(() => {
    setFilterOptions(defaultFilterOptions);
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.values(currentFilters || {}).filter(
      (value) =>
        // @ts-ignore
        value !== null && value !== false && value?.length !== 0 && value !== '' && value !== 0
    ).length;
  }, [currentFilters]);

  const { styles, theme } = useStyles(stylesheet);

  return (
    <>
      <View style={styles.filterButton}>
        <IconButton
          iconSource={'filter'}
          onPress={onFilter}
          iconColor={theme.colors.onBackground}
        />
        {!!activeFilterCount && (
          <View style={[styles.counter, { backgroundColor: theme.colors.primary }]}>
            <Typography
              variant={'titleSmall'}
              style={{
                color: theme.colors.background,
              }}
            >
              {activeFilterCount}
            </Typography>
          </View>
        )}
      </View>
      <BottomSheet
        bottomSheetRef={optionsRef}
        snapPoints={snapPoints}
        onDismiss={() => {
          setFilterOptions(defaultFilterOptions);
        }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Typography variant={'titleLarge'}>Filter Options</Typography>
            <LabelButton onPress={onReset} hitSlop={styles.resetButtonHitSlop} title={'reset'} />
          </View>
          <View style={styles.content}>
            <StarRating
              style={styles.rating}
              initialValue={filterOptions?.rating || 0}
              onChange={(rating) => updateFilterOption('rating', rating)}
            />
            <Typography style={styles.tagTitle} variant={'titleMedium'}>
              Tags
            </Typography>
            <FlatList
              keyExtractor={(item) => item.id || ''}
              keyboardDismissMode={'on-drag'}
              contentContainerStyle={styles.tagList}
              data={(data as Tag[] | undefined) || []}
              renderItem={onRenderItem}
            />
          </View>
          <PrimaryButton style={styles.saveButton} onPress={onSaved} title={'Save'} />
        </View>
      </BottomSheet>
    </>
  );
};

export default FilterOptions;
