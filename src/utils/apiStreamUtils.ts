
import { supabase } from '@/integrations/supabase/client';

export const callAPIStream = async (
  functionName: string,
  body: Record<string, any>,
  onChunk: (chunk: string) => void,
  onError: (error: any) => void,
  onComplete: () => void
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("Failed to get response reader");
    }

    const decoder = new TextDecoder();
    
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkString = decoder.decode(value);
        const lines = chunkString.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
            const jsonString = line.replace(/^data: /, '');
            if (jsonString.trim() === '[DONE]') {
                break;
            }
            try {
                const parsed = JSON.parse(jsonString);
                const content = parsed.choices[0]?.delta?.content;
                if (content) {
                    onChunk(content);
                }
            } catch (e) {
                // Ignore parsing errors for incomplete chunks
            }
        }
    }
    onComplete();
  } catch (error) {
    console.error(`Error in callAPIStream for ${functionName}:`, error);
    onError(error);
  }
};
