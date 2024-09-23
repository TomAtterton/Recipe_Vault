import React, { useCallback, useMemo } from 'react';
import { Tabs } from 'react-native-collapsible-tab-view';
import { Ingredient, Instruction } from '@/types';
import useGetRecipeInstructions from '@/database/api/recipes/hooks/useGetRecipeInstructions';
import { stylesheet } from './instructions.style';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { FlatList, View } from 'react-native';
import MarkdownText from '@/screens/RecipeDetail/components/Instructions/MarkdownText';
import { flattenSanitizeIngredients } from '@/services/parser/ingredients/ingredientsParser';

interface InstructionsProps {
  recipeId: string;
  ingredients: Ingredient[];
  initialServings: number;
}

type StepInstruction =
  | ({
      step: number;
    } & Instruction)
  | string;

const keyExtractor = (_: StepInstruction, index: number) => index.toString();

const Instructions: React.FC<InstructionsProps> = ({
  recipeId,
  ingredients,
  initialServings,
}: InstructionsProps) => {
  const { instructions: data } = useGetRecipeInstructions(recipeId);

  const sections = useMemo(() => {
    let currentIndex = 1; // Start at 1 to ensure the first step is correctly indexed

    return (
      data?.reduce((acc: (string | StepInstruction)[], instruction) => {
        const title = instruction?.title || '';

        if (title) {
          const hasTitle = acc.find((item) => item === title);
          if (!hasTitle) {
            acc.push(title);
            currentIndex = 1; // Reset index for new sections
          }
        }

        acc.push({ ...instruction, step: currentIndex });
        currentIndex++; // Increment the index for the next step
        return acc;
      }, []) || []
    );
  }, [data]);

  const { styles, breakpoint } = useStyles(stylesheet);

  const sanitizedIngredients = useMemo(
    () => flattenSanitizeIngredients(ingredients),
    [ingredients],
  );

  const handleRenderInstruction = useCallback(
    ({ item }: { item: StepInstruction }) => {
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
          <MarkdownText
            text={item?.text}
            sanitizedIngredients={sanitizedIngredients}
            ingredients={ingredients}
            initialServings={initialServings}
          />
        </View>
      );
    },
    [
      styles.stepContainer,
      styles.stepTitle,
      styles.sectionHeader,
      sanitizedIngredients,
      ingredients,
      initialServings,
    ],
  );

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
