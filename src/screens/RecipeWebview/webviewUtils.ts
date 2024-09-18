/**
 * This injectedJavaScript is used to extract recipe data from a webpage.
 */
export const injectedJavaScript = `
(function() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  let jsonData = null;
  
  const isRecipeType = (data) => {
    if (!data || typeof data !== 'object') return false;
    const types = Array.isArray(data['@type']) ? data['@type'] : [data['@type']];
    return types.some(type => type?.toLowerCase() === 'recipe');
  };

  const parseJsonSafely = (scriptContent) => {
    try {
      return JSON.parse(scriptContent);
    } catch (error) {
      console.error('Error parsing JSON:', error.message);
      return null;
    }
  };

  const findRecipeInGraph = (graph) => {
    return graph.find(item => isRecipeType(item));
  };

  const validateRecipe = (recipe) => {
    return recipe && 
           isRecipeType(recipe) && 
           Array.isArray(recipe.recipeIngredient) &&
           recipe.recipeIngredient.length > 0;
  };

  let foundRecipe = false;

  for (const script of scripts) {
    if (!script?.textContent?.trim()) continue;
    
    const parsedData = parseJsonSafely(script.textContent);
    if (!parsedData) continue;

    const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

    for (const item of dataArray) {
      if (item['@graph'] && Array.isArray(item['@graph'])) {
        const graphRecipe = findRecipeInGraph(item['@graph']);
        if (graphRecipe) {
          jsonData = { ...item, ...graphRecipe };
        }
      } else if (isRecipeType(item)) {
        jsonData = item;
      }

      if (validateRecipe(jsonData)) {
        foundRecipe = true;
        break;
      }
    }

    if (foundRecipe) break;
  }

  if (foundRecipe) {
    window.ReactNativeWebView.postMessage(JSON.stringify(jsonData));
  } else {
    window.ReactNativeWebView.postMessage('doesNotContainRecipe');
  }
})();
`;

const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;

export const onHandleGoogleSearch = (url: string) => {
  if (!urlRegex.test(url)) {
    url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
  } else if (!url.startsWith('http') && !url.startsWith('https')) {
    url = 'https://' + url;
  }
  return url;
};
