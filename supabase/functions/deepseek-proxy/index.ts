
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
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

    if (req.method !== 'POST') {
      console.warn('Received non-POST request:', req.method);
      return new Response(JSON.stringify({ error: 'Only POST requests are accepted.' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { systemPrompt, userPrompt, stream: streamRequested } = await req.json();
    const useStream = streamRequested !== false; // Default to streaming
    
    console.log(`Received prompts. Streaming: ${useStream}`);

    const deepSeekResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: useStream,
      }),
    });

    console.log('DeepSeek API response status:', deepSeekResponse.status);

    if (!deepSeekResponse.ok) {
      const errorData = await deepSeekResponse.text();
      console.error('DeepSeek API error:', errorData);
      return new Response(JSON.stringify({ error: `Failed to fetch from DeepSeek API: ${errorData}` }), {
        status: deepSeekResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (useStream) {
      console.log('Piping stream from DeepSeek API.');
      const stream = new ReadableStream({
        async start(controller) {
          const reader = deepSeekResponse.body?.getReader();
          if (!reader) {
              console.error("Failed to get reader from DeepSeek response body.");
              controller.close();
              return;
          }
          try {
              // eslint-disable-next-line no-constant-condition
              while (true) {
                  const { done, value } = await reader.read();
                  if (done) {
                      break;
                  }
                  controller.enqueue(value);
              }
          } catch (error) {
              console.error('Error while reading from DeepSeek stream:', error);
              controller.error(error);
          } finally {
              controller.close();
              reader.releaseLock();
          }
        },
      });
      return new Response(stream, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream; charset=utf-8',
        },
        status: 200
      });
    } else {
      console.log('Fetching non-streamed response from DeepSeek API.');
      const responseData = await deepSeekResponse.json();
      const content = responseData.choices?.[0]?.message?.content;
      
      if (!content) {
          console.error('No content in non-streaming response from DeepSeek API:', responseData);
          return new Response(JSON.stringify({ error: 'No content in API response.' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
      }
    
      return new Response(JSON.stringify({ content: content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
      });
    }

  } catch (error) {
    console.error('Error in deepseek-proxy function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
