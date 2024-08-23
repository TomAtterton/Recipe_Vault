import { createHash } from 'https://deno.land/std@0.104.0/hash/mod.ts';

const handler = async (req: Request) => {
  try {
    // Parse the request body to get parameters
    const { public_id, ...extraParams } = await req.json();

    if (!public_id) {
      return new Response(JSON.stringify({ error: 'public_id is required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Retrieve Cloudinary API key and secret from environment variables
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY') || '';
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET') || '';

    if (!apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: 'Cloudinary API credentials are missing' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Get the current timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // Collect the parameters with only public_id and timestamp
    const params: { [key: string]: string } = {
      timestamp: timestamp.toString(),
      public_id,
      ...extraParams, // Include only additional params provided
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
      signature: signature,
      ...extraParams, // Include any additional params that were provided
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
