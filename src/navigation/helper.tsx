import { CommonActions } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';

export const navigateToAddRecipe = ({
  navigation,
  params,
  shouldReplace,
}: {
  navigation: any;
  params: {
    type?: string;
    id?: string | null;
    isNested?: boolean;
    data?: any;
  };
  shouldReplace?: boolean;
}) => {
  // Get current routes from the stack
  const currentRoutes = navigation.getState().routes;

  // Filter out the 'AddRecipe' screen from the history
  // @ts-ignore
  const filteredRoutes = currentRoutes.filter((route) => route.name !== Routes.AddRecipe);

  // If shouldReplace is true, reset the stack with the filtered routes
  if (shouldReplace) {
    navigation.dispatch(
      // @ts-ignore
      CommonActions.reset({
        index: filteredRoutes.length, // Set the index to the end of the filtered stack
        routes: [
          ...filteredRoutes, // Pass the existing stack minus the removed screen
          { name: Routes.AddRecipe, params }, // Add 'AddRecipe' as the last route
        ],
      }),
    );
  } else {
    // Otherwise, just navigate to AddRecipe
    navigation.navigate(Routes.AddRecipe, {
      ...params,
    });
  }
};
