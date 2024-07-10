/**
 * This injectedJavaScript is used to extract recipe data from a webpage.
 */
export const injectedJavaScript = `
  (function() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  let foundRecipe = false;
  let jsonData = null;
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    try {
      if (!script?.textContent) {
        continue;
      }
      const parseData = JSON.parse(script.textContent);

      jsonData = Array.isArray(parseData) ? parseData[0] : parseData;

      if (parseData['@graph']) {
        const graph = parseData['@graph'];
        const graphRecipe = graph.find((item) => item['@type']?.toLowerCase() === 'recipe');
        if (graphRecipe) {
          jsonData = { ...parseData, ...graphRecipe };
        }
      }


      const isRecipeType = () => {
        if (Array.isArray(jsonData['@type'])) {
          return jsonData['@type'].includes('Recipe');

        }
        return jsonData?.['@type']?.toLowerCase() === 'recipe';
      };

      if (isRecipeType() && jsonData['recipeIngredient'] && Array.isArray(jsonData['recipeIngredient'])){
      
        foundRecipe = true;
        break; // Exit loop if recipe is found
      }
    } catch (error) {
      window.ReactNativeWebView.postMessage(error);
      // JSON parsing error, continue to the next script tag
      continue;
    }
  }

  // if (!foundRecipe) {
  //   const itempropElements = document.querySelectorAll(
  //     '[itemprop="name"], [itemprop="recipeIngredient"]'
  //   );
  //
  //   for (const element of itempropElements) {
  //     if (element.textContent.trim() !== '') {
  //       foundRecipe = true;
  //       break; // Exit loop if recipe information is found
  //     }
  //   }
  // }

  if (foundRecipe) {
    window.ReactNativeWebView.postMessage(jsonData ? JSON.stringify(jsonData) : 'containsRecipe');
  } else {
    window.ReactNativeWebView.postMessage('doesNotContainRecipe');
  }
  })();
`;

export const onHandleGoogleSearch = (url: string) => {
  if (
    !url.endsWith('.com') &&
    !url.endsWith('.de') &&
    !url.endsWith('.co.uk') &&
    !url.endsWith('.nl') &&
    !url.endsWith('.at')
  ) {
    url = 'https://www.google.com/search?q=' + url;
  }

  if (!url.startsWith('http') && !url.startsWith('https')) {
    url = 'https://' + url;
  }

  return url;
};
