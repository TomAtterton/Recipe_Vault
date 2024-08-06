import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.4';
import OpenAI from 'https://deno.land/x/openai@v4.53.2/mod.ts';

// const { GoogleGenerativeAI } = 'npm:@google/generative-ai';

const openAIKey = Deno.env.get('OPENAI_API_KEY');

const geminiKey = Deno.env.get('GEMINI_API_KEY');

const openAIModel = 'gpt-4o-mini';
const geminiAIModel = 'gemini-1.5-flash';

const prompt =
  'Return only a JSON object containing title with the key value name, prepTime and performTime in ms time if they exist, servings should just return one number the highest if more than one, instructions as an array, and ingredients as an array from this text:';

Deno.serve(async (req: Request) => {
  try {
    const { query } = await req.json();

    if (!query) {
      return new Response('Missing query', { status: 400 });
    }

    const isPro = await checkIfPro(req);

    if (!isPro) {
      throw new Error('You do not have access to pro features');
    }

    let response = {};

    response = await requestWithOpenAi(query);

    const formattedResponse = {
      name: response.name || '',
      prepTime: response.prepTime || '',
      performTime: response.performTime || '',
      servings: response.servings || 0,
      recipeInstructions: response.instructions || [],
      recipeIngredients: response.ingredients || [],
    };

    return new Response(JSON.stringify(formattedResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log('Error generating recipe', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

// const requestWithAi = async (query: string) => {
//   try {
//     return await requestWithGemini(query);
//   } catch (e) {
//     console.log('calling open ai');
//     return await requestWithOpenAi(query);
//   }
// };

// const requestWithGemini = async (query: string) => {
//   try {
//     if (!geminiKey) {
//       throw new Error('API key is missing');
//     }
//     const genAI = new GoogleGenerativeAI(geminiKey);
//     const model = genAI.getGenerativeModel({
//       model: geminiAIModel,
//       generationConfig: { responseMimeType: 'application/json' },
//     });
//
//     const result = await model.generateContent(`${prompt} ${query}`);
//     const response = await result.response;
//     console.log('response', response);
//     return response.text() || {};
//   } catch (e) {
//     throw e;
//   }
// };

const requestWithOpenAi = async (query: string) => {
  try {
    if (!openAIKey) {
      throw new Error('API key is missing');
    }

    const openai = new OpenAI({ openAIKey });

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `${prompt} ${query}`,
        },
      ],
      response_format: { type: 'json_object' },
      model: openAIModel,
      stream: false,
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content) || {};
  } catch (e) {
    throw e;
  }
};

const checkIfPro = async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: req.headers.get('Authorization')! } },
  });

  const { error: user_error, data: userData } = await supabaseClient.auth.getUser();

  if (user_error) throw new Error('There was an issue getting the user data');

  const { data: profile, error: profile_error } = await supabaseClient
    .from('profile_groups')
    .select('group_id')
    .eq('profile_id', userData.user.id || '');

  if (profile_error) throw new Error('There was an issue getting the profile data');
  if (!profile || profile.length === 0) return false;

  const groupId = profile[0].group_id;

  const { data: proVaults, error: pro_vaults_error } = await supabaseClient
    .from('pro_vaults')
    .select('*')
    .eq('group_id', groupId || '');

  if (pro_vaults_error) throw new Error('There was an issue getting the pro vaults data');

  return proVaults && proVaults.length > 0;
};
