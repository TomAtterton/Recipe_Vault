import OpenAI from 'https://deno.land/x/openai@v4.53.2/mod.ts';

const apiKey = Deno.env.get('OPENAI_API_KEY');
const model = 'gpt-4o-mini';
const prompt =
  'Return only a JSON object containing title with the key value name, prepTime and performTime in ms time if they exist, servings should just return one number the highest if more than one, instructions as an array, and ingredients as an array from this text:';
Deno.serve(async (req: Request) => {
  try {
    const { query } = await req.json();

    if (!query) {
      return new Response('Missing query', { status: 400 });
    }

    if (!apiKey) {
      return new Response('API key is missing', { status: 500 });
    }

    const openai = new OpenAI({ apiKey });
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `${prompt} ${query}`,
        },
      ],
      response_format: { type: 'json_object' },
      model: model,
      stream: false,
    });

    const reply = JSON.parse(chatCompletion.choices[0]?.message?.content) || {};

    const formattedResponse = {
      name: reply.name || '',
      prepTime: reply.prepTime || '',
      performTime: reply.performTime || '',
      servings: reply.servings || 0,
      recipeInstructions: reply.instructions || [],
      recipeIngredients: reply.ingredients || [],
    };

    return new Response(JSON.stringify(formattedResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log('Error generating recipe', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});
