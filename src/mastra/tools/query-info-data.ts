import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import type { QueryResult } from '@mastra/core/vector';
import { OpenAI } from 'openai';

import { summarizeText, normalizeWixUrl } from '../utils';
import { IMAGE_URLS_DELIMITER, VIETNAMESE_PATTERN } from '../constants';
import { INFO_HUB_PROMPT } from '../constants/infoHub/prompts';
import { cloudflareVector, infoHubStoreIndexName } from '../storages';
import { InfoHubKnowledgeStore } from '../agents/infoHub/info-hub-knowledge-store';
import { INFO_HUB_RAG_PROMPT } from '../agents/rag/constants/infoHub-rag-prompt';

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

/**
 * Collect image data from vector query results metadata.
 * Metadata stores images as "alt1|url1;;;alt2|url2" format (;;; separator to avoid
 * conflicts with commas in Wix URLs like "w_175,h_175,al_c,q_80,...").
 * Returns structured entries like "SpeakerName: https://..." for LLM matching.
 * All wixstatic URLs are normalized at this point to ensure they load correctly.
 */
const collectImageData = (results: QueryResult[]): string[] => {
  const entries = new Map<string, string>();

  for (const item of results) {
    const imageUrls = item?.metadata?.imageUrls as string | undefined;
    if (!imageUrls) continue;

    // Use IMAGE_URLS_DELIMITER as primary delimiter (new format); fall back to ',' for legacy data
    const delimiter = imageUrls.includes(IMAGE_URLS_DELIMITER) ? IMAGE_URLS_DELIMITER : ',';
    for (const entry of imageUrls.split(delimiter)) {
      const trimmed = entry.trim();
      if (!trimmed) continue;

      const pipeIndex = trimmed.indexOf('|');
      if (pipeIndex > 0) {
        // Structured format: "alt|url"
        const label = trimmed.substring(0, pipeIndex).trim();
        const rawUrl = trimmed.substring(pipeIndex + 1).trim();
        const url = normalizeWixUrl(rawUrl);
        if (url && !entries.has(url)) {
          entries.set(url, label ? `${label}: ${url}` : url);
        }
      } else {
        // Legacy format: just URL
        const url = normalizeWixUrl(trimmed);
        if (!entries.has(url)) {
          entries.set(url, url);
        }
      }
    }
  }

  return [...entries.values()];
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

    // Collect image data (alt|url pairs) from the retrieved chunks' metadata
    const imageData = collectImageData(results);

    // Use the ORIGINAL query in the RAG prompt so it responds in the user's language
    const answer = await summarizeText(
      '', // Already combined in prompt
      '', // Already combined in prompt
      INFO_HUB_RAG_PROMPT.answer_prompt(originalQuery, formalizedResults, imageData),
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
