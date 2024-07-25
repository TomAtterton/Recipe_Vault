import React from 'react';

import { Tabs } from 'react-native-collapsible-tab-view';
import { Ingredient, Instruction } from '@/types';
import useGetRecipeInstructions from '@/database/api/recipes/hooks/useGetRecipeInstructions';
import { stylesheet } from './instructions.style';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { FlatList, View } from 'react-native';
import MarkdownText from '@/screens/RecipeDetail/components/Instructions/MarkdownText';

interface InstructionsProps {
  recipeId: string;
  ingredients: Ingredient[];
}

let currentIndex = 0;
type StepInstruction =
  | ({
      step: number;
    } & Instruction)
  | string;

const keyExtractor = (_: StepInstruction, index: number) => index.toString();

const Instructions: React.FC<InstructionsProps> = ({
  recipeId,
  ingredients,
}: InstructionsProps) => {
  const { instructions: data } = useGetRecipeInstructions(recipeId);

  const sections = data?.reduce((acc: (string | StepInstruction)[], instruction, index) => {
    const title = instruction?.title || '';
    currentIndex = index === 0 ? 1 : currentIndex + 1;
    if (title) {
      const hasTitle = acc.find((item) => item === title);

      if (!hasTitle) {
        currentIndex = 1;
        acc.push(title);
      }
    }

    acc.push({ ...instruction, step: currentIndex });
    return acc;
  }, []);

  const { styles, breakpoint } = useStyles(stylesheet);
  const handleRenderInstruction = ({ item }: { item: StepInstruction }) => {
    if (typeof item === 'string') {
      return (
        <Typography variant={'titleItalicLarge'} style={styles.sectionHeader}>
          {item}
        </Typography>
      );
    }

    return (
      <View style={styles.stepContainer}>
        <Typography variant={'titleMedium'} style={styles.stepTitle}>
          {`${item?.step}.`}
        </Typography>
        <MarkdownText text={item?.text} ingredients={ingredients} />
      </View>
    );
  };

  const isiPad = breakpoint === 'xl' || breakpoint === 'lg' || breakpoint === 'md';

  const ListComponent = isiPad ? FlatList : Tabs.FlatList;
  return (
    <ListComponent
      keyExtractor={keyExtractor}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={sections}
      renderItem={handleRenderInstruction}
    />
  );
};

export default Instructions;
