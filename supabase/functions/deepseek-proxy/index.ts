
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Recommended for Deno Deploy, using URL import
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'; // Ensure using a recent, stable version

// Define CORS headers. '*' is generally fine for development,
// but for production, you might want to restrict it to your app's domain.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or your specific domain like 'https://your-app.com'
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Specify allowed methods
};

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('deepseek-proxy function invoked, method:', req.method);
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY is not set in environment variables.');
      return new Response(JSON.stringify({ error: 'API key not configured server-side.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ensure the request is POST
    if (req.method !== 'POST') {
      console.warn('Received non-POST request:', req.method);
      return new Response(JSON.stringify({ error: 'Only POST requests are accepted.' }), {
        status: 405, // Method Not Allowed
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { systemPrompt, userPrompt } = await req.json();
    console.log('Received prompts:', { systemPrompt, userPrompt });

    const deepSeekResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Or your preferred model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        // Add any other parameters like temperature, max_tokens if needed
      }),
    });

    console.log('DeepSeek API response status:', deepSeekResponse.status);
    const deepSeekData = await deepSeekResponse.json();

    if (!deepSeekResponse.ok) {
      console.error('DeepSeek API error:', deepSeekData);
      // Relay the error structure from DeepSeek if possible, or a generic one
      return new Response(JSON.stringify({ error: deepSeekData.error || 'Failed to fetch from DeepSeek API' }), {
        status: deepSeekResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('Successfully fetched data from DeepSeek API.');
    // Assuming the useful content is in choices[0].message.content
    const content = deepSeekData.choices && deepSeekData.choices[0] && deepSeekData.choices[0].message && deepSeekData.choices[0].message.content
      ? deepSeekData.choices[0].message.content
      : deepSeekData; // Fallback to returning the whole data if structure is unexpected

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in deepseek-proxy function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

