import { OpenAI } from 'openai';

export const summarizeText = async (
  message: string,
  content: string,
  prompt = '',
) => {
  // Generate title using LLM (using OpenAI SDK directly to avoid version conflicts)
  const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openaiClient.chat.completions.create({
    model: process.env.LLM_OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content:
          prompt ||
          `Summarize the content in one short sentence (6–12 words) to answer the message "${message}". Be concise and descriptive.
        Rephrase the message if it contains the following phrases:
        - Rephrase Maximum number of likes/dislikes to most-liked/disliked items
        - Rephrase Minimum number of likes/dislikes to fewest-liked/disliked items
        
        Content: "${content}"
        Result:
        `,
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
  });

  return (completion.choices[0]?.message?.content || 'Summarize message')
    .trim()
    .replace(/^["']|["']$/g, '');
};
