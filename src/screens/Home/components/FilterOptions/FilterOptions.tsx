import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Keyboard, View } from 'react-native';

interface Props {
  currentFilters: FilterObjectType;
  onUpdateFilter: (filterOptions: FilterObjectType) => void;
}

import { Tag } from '@/types';
import { FilterObjectType } from '@/utils/filterUtils';
import useGetTags from '@/database/api/tags/useGetTags';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import CheckBox from '@/components/CheckBox';
import IconButton from '@/components/buttons/IconButton';
import LabelButton from '@/components/buttons/LabelButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import StarRating from '@/components/StarRating';
import { stylesheet } from './filterOptions.style';
import { translate } from '@/core';

export const defaultFilterOptions = {
  hasNotRated: false,
  rating: null,
  tags: [],
};

const keyExtractor = (item: Tag) => item.id || '';

const FilterOptions = ({ currentFilters, onUpdateFilter }: Props) => {
  const onFilter = useCallback(() => {
    setFilterOptions(currentFilters);
    Keyboard.dismiss();
    optionsRef.current?.present();
  }, [currentFilters]);

  const optionsRef = React.useRef<BottomSheetRef>(null);

  const [filterOptions, setFilterOptions] = useState<FilterObjectType>({
    hasNotRated: currentFilters?.hasNotRated || false,
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
    [],
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
    [filterOptions?.tags, updateFilterOption],
  );

  const onSaved = useCallback(() => {
    filterOptions && onUpdateFilter(filterOptions);
    optionsRef.current?.dismiss();
  }, [filterOptions, onUpdateFilter]);

  const onReset = useCallback(() => {
    setFilterOptions(defaultFilterOptions);
    onUpdateFilter(defaultFilterOptions);
    optionsRef.current?.dismiss();
  }, [onUpdateFilter]);

  const activeFilterCount = useMemo(() => {
    return Object.values(currentFilters || {}).filter(
      (value) =>
        // @ts-ignore
        value !== null && value !== false && value?.length !== 0 && value !== '' && value !== 0,
    ).length;
  }, [currentFilters]);

  const { styles, theme } = useStyles(stylesheet);

  const hasChanged = useMemo(() => {
    return (
      filterOptions?.hasNotRated !== currentFilters?.hasNotRated ||
      filterOptions?.rating !== currentFilters?.rating ||
      filterOptions?.tags?.length !== currentFilters?.tags?.length
    );
  }, [currentFilters, filterOptions]);

  return (
    <>
      <View style={styles.filterButton}>
        <IconButton
          iconSource={'filter'}
          onPress={onFilter}
          iconColor={theme.colors.onBackground}
        />
        {!!activeFilterCount && (
          <View style={styles.counter}>
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
        snapPoints={['80%']}
        onDismiss={() => {
          setFilterOptions(defaultFilterOptions);
        }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Typography variant={'titleLarge'}>{translate('filter.title')}</Typography>
            <LabelButton
              onPress={onReset}
              hitSlop={styles.resetButtonHitSlop}
              title={translate('filter.reset')}
            />
          </View>
          <View style={styles.content}>
            <Typography style={styles.contentTitle} variant={'titleMedium'}>
              {translate('filter.rating')}
            </Typography>
            <CheckBox
              style={styles.checkbox}
              isSelected={filterOptions?.hasNotRated}
              label={'No Rating'}
              onPress={() => updateFilterOption('hasNotRated', !filterOptions?.hasNotRated)}
            />
            <StarRating
              padding={40}
              disabled={filterOptions?.hasNotRated}
              initialValue={filterOptions?.rating || 0}
              onChange={(rating) => updateFilterOption('rating', rating)}
            />
            {data && data.length > 0 && (
              <>
                <Typography style={styles.contentTitle} variant={'titleMedium'}>
                  {translate('filter.tags')}
                </Typography>
                <FlatList
                  keyExtractor={keyExtractor}
                  keyboardDismissMode={'on-drag'}
                  contentContainerStyle={styles.tagList}
                  data={(data as Tag[] | undefined) || []}
                  renderItem={onRenderItem}
                />
              </>
            )}
          </View>
          <PrimaryButton
            disabled={!hasChanged}
            style={styles.saveButton}
            onPress={onSaved}
            title={translate('filter.save')}
          />
        </View>
      </BottomSheet>
    </>
  );
};

export default FilterOptions;
