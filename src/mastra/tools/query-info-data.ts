import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import type { QueryResult } from '@mastra/core/vector';
import { OpenAI } from 'openai';

import { INFO_HUB_PROMPT } from '../constants/infoHub/prompts';
import { cloudflareVector, infoHubStoreIndexName } from '../storages';
import { InfoHubKnowledgeStore } from '../agents/infoHub/info-hub-knowledge-store';
import { summarizeText } from '../utils';
import { INFO_HUB_RAG_PROMPT } from '../agents/rag/constants/infoHub-rag-prompt';
import { VIETNAMESE_PATTERN } from '../constants';

export const queryInfoDataTool = createTool({
  id: INFO_HUB_PROMPT.queryInfoDataTool.key,
  description: INFO_HUB_PROMPT.queryInfoDataTool.description,
  inputSchema: z.object({
    query: z.string().optional().describe('User query (supports English and Vietnamese)'),
  }),
  execute: async ({ query }) => {
    return await queryInfoDataToolExecute({ query });
  },
});

/**
 * Detect if the query contains Vietnamese characters/words
 * and translate to English for better vector search results.
 * Returns both the original query (for response language) and
 * the English query (for vector search).
 */
const translateQueryForSearch = async (
  query: string,
): Promise<{ originalQuery: string; searchQuery: string }> => {
  // Check if query contains Vietnamese-specific characters

  if (!VIETNAMESE_PATTERN.test(query)) {
    return { originalQuery: query, searchQuery: query };
  }

  try {
    const openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openaiClient.chat.completions.create({
      model: process.env.LLM_OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Translate the following Vietnamese query to English for semantic search purposes. Return ONLY the English translation, nothing else.\n\nVietnamese: "${query}"\nEnglish:`,
        },
      ],
      max_tokens: 100,
      temperature: 0,
    });

    const translated = (
      completion.choices[0]?.message?.content || query
    ).trim();


    return { originalQuery: query, searchQuery: translated };
  } catch (error) {
    console.warn('[queryInfoData] Translation failed, using original query:', error);
    return { originalQuery: query, searchQuery: query };
  }
};

const queryInfoDataToolExecute = async ({ query }: { query?: string }) => {
  try {
    const normalizedMessage =
      query?.trim() ||
      "Provide the most relevant page evidence to answer the user's question.";

    // Translate Vietnamese queries to English for better vector search results
    const { originalQuery, searchQuery } =
      await translateQueryForSearch(normalizedMessage);

    const infoStore = new InfoHubKnowledgeStore({
      vector: cloudflareVector,
      indexName: infoHubStoreIndexName,
    });

    // Use the English (translated) query for vector search
    const results = (await infoStore.queryStore({
      message: searchQuery,
    })) as QueryResult[];

    const formalizedResults = results
      .map((item) => item?.metadata?.text)
      .join('\n');

    // Use the ORIGINAL query in the RAG prompt so it responds in the user's language
    const answer = await summarizeText(
      '', // Already combined in prompt
      '', // Already combined in prompt
      INFO_HUB_RAG_PROMPT.answer_prompt(originalQuery, formalizedResults),
    );

    let parsed;
    try {
      const cleaned = answer
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      parsed = JSON.parse(cleaned);
    } catch {
      // Expected for GENERAL_QUERY responses (natural language, not JSON)
      parsed = null;
    }

    if (parsed) {
      const data = Array.isArray(parsed) ? parsed : (parsed.data ?? parsed);
      return JSON.stringify(data);
    }

    return answer;
  } catch (error: unknown) {
    console.error('queryInfoDataToolExecute error:', error);
    return JSON.stringify({
      success: false,
      message: 'Failed to query information. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
