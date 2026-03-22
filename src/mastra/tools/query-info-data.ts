import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import type { QueryResult } from '@mastra/core/vector';

import { INFO_HUB_PROMPT } from '../constants/infoHub/prompts';
import { cloudflareVector, infoHubStoreIndexName } from '../storages';
import { InfoHubKnowledgeStore } from '../agents/infoHub/info-hub-knowledge-store';
import { summarizeText } from '../utils';
import { INFO_HUB_RAG_PROMPT } from '../agents/rag/constants/infoHub-rag-prompt';

export const queryInfoDataTool = createTool({
  id: INFO_HUB_PROMPT.queryInfoDataTool.key,
  description: INFO_HUB_PROMPT.queryInfoDataTool.description,
  inputSchema: z.object({
    query: z.string().optional().describe('User query'),
  }),
  execute: async ({ query }) => {
    return await queryInfoDataToolExecute({ query });
  },
});

const queryInfoDataToolExecute = async ({ query }: { query?: string }) => {
  try {
    const normalizedMessage =
      query?.trim() ||
      "Provide the most relevant page evidence to answer the user's question.";

    const infoStore = new InfoHubKnowledgeStore({
      vector: cloudflareVector,
      indexName: infoHubStoreIndexName,
    });

    const results = (await infoStore.queryStore({
      message: normalizedMessage,
    })) as QueryResult[];

    const formalizedResults = results
      .map((item) => item?.metadata?.text)
      .join('\n');
    const answer = await summarizeText(
      '', // Already combined in prompt
      '', // Already combined in prompt
      INFO_HUB_RAG_PROMPT.answer_prompt(normalizedMessage, formalizedResults),
    );

    let parsed;
    try {
      const cleaned = answer
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error(e);

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
