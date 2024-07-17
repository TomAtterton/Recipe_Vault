import { createHash } from 'https://deno.land/std@0.104.0/hash/mod.ts';

const handler = async (req: Request) => {
  try {
    // Parse the request body to get public_id
    const { public_id, folder, ...extraParams } = await req.json();

    // Define your Cloudinary API key and secret
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

    // Get the current timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // Collect the parameters
    const params: { [key: string]: string } = {
      eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop',
      timestamp: timestamp.toString(),
      public_id,
      folder,
      ...extraParams,
    };

    // Sort the parameters alphabetically and create the query string
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    // Append the API secret to the query string
    const stringToSign = `${sortedParams}${apiSecret}`;

    // Create the SHA-1 hash
    const hash = createHash('sha1');
    hash.update(stringToSign);
    const signature = hash.toString();

    // Construct the response with the required parameters
    const response = {
      timestamp: params.timestamp,
      public_id: params.public_id,
      api_key: apiKey,
      eager: params.eager,
      signature: signature,
    };

    // Respond with the final parameters
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'something went wrong' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

Deno.serve(handler);
