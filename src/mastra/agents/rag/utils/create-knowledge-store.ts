import { CloudflareVector } from '@mastra/vectorize';
import { embedMany } from 'ai';

import { customEmbeddingProvider } from '../custom-provider';

// Types
import { chunkDocFromText } from '@/mastra/utils';

const stripHtmlTags = (html: string) => {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, '');
  const withoutTags = withoutStyles.replace(/<\/?[^>]+(>|$)/g, ' ');
  const normalizedWhitespace = withoutTags.replace(/\s+/g, ' ').trim();
  return normalizedWhitespace;
};

type CreateKnowledgeStoreFromHtmlParams = {
  url?: string;
  html?: string;
  indexName: string;
  cloudflareVectorStore: CloudflareVector;
  log?: boolean;
};

export const createKnowledgeStoreFromHtml = async ({
  url,
  html,
  indexName,
  cloudflareVectorStore,
  log = true,
}: CreateKnowledgeStoreFromHtmlParams) => {
  if (!url && !html) {
    throw new Error('Either url or html must be provided');
  }

  const rawHtml =
    html ||
    (await (async () => {
      const res = await fetch(url as string);
      if (!res.ok) {
        throw new Error(`Failed to fetch HTML from ${url}: ${res.statusText}`);
      }
      return res.text();
    })());

  const text = stripHtmlTags(rawHtml);

  if (!text) {
    throw new Error('No text content extracted from HTML');
  }

  if (log) {
    console.log('1. Started creating knowledge store from HTML...');
  }

  await cloudflareVectorStore.createIndex({
    indexName,
    dimension: 1536,
  });

  if (log) {
    console.log(`2. Created index ${indexName}`);
  }

  const chunks = await chunkDocFromText(text, log);

  if (log) {
    console.log(`3. Chunked HTML text, total chunks: ${chunks.length}`);
  }

  const { embeddings } = await embedMany({
    model: customEmbeddingProvider({
      model: process.env.LLM_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
      formalizeData: (values: string[] | string) => values as string,
      log,
    }),
    values: chunks?.map((chunk: any) => chunk.text),
  });

  await cloudflareVectorStore.upsert({
    indexName,
    vectors: embeddings,
    metadata: chunks.map((chunk: any) => ({
      text: chunk.text,
      source: url || `html-${indexName}`,
    })),
  });

  if (log) {
    console.log(
      `4. All HTML chunks (${chunks.length}) embedded and upserted successfully!!`,
    );
  }
};
