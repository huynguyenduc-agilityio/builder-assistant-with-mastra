import { embedMany } from 'ai';

import { chunkDocFromText } from '@/mastra/utils';
import type { CreateKnowledgeStoreFromHtmlParams } from '@/mastra/types';
import { IMAGE_URLS_DELIMITER } from '@/mastra/constants';

import { customEmbeddingProvider } from '../custom-provider';
import { stripHtmlTags, stripHtmlPreserveLines, cleanTextContent } from './html';
import { extractImagesFromHtml, associateImagesWithChunks } from './image';
import { extractStructuredSpeakerChunks } from './speaker';

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

  // Extract images BEFORE stripping HTML tags
  const images = extractImagesFromHtml(rawHtml);

  if (log) {
    console.log(`0. Extracted ${images.length} images from HTML`);
    images.slice(0, 5).forEach((img, i) => {
      console.log(`   [${i}] alt="${img.alt}" filename="${img.filename}" src=${img.src.substring(0, 100)}...`);
    });
  }

  const rawText = stripHtmlTags(rawHtml);

  if (!rawText) {
    throw new Error('No text content extracted from HTML');
  }

  // Clean text: remove irrelevant sections (partners, footer)
  const text = cleanTextContent(rawText);

  // Use line-preserving strip for structured speaker extraction
  const textWithLines = stripHtmlPreserveLines(rawHtml);

  // Extract structured speaker chunks from the AGENDA section
  const speakerChunks = extractStructuredSpeakerChunks(textWithLines);

  if (log) {
    console.log(`0.5. Extracted ${speakerChunks.length} structured speaker entries`);
    speakerChunks.slice(0, 3).forEach((s, i) => console.log(`   [${i}] ${s}`));
    console.log('1. Started creating knowledge store from HTML...');
  }

  await cloudflareVectorStore.createIndex({
    indexName,
    dimension: 1536,
  });

  if (log) {
    console.log(`2. Created index ${indexName}`);
  }

  // Chunk the cleaned general text
  const generalChunks = await chunkDocFromText(text, log);

  // Prepend structured speaker chunks (each one is its own chunk)
  const speakerChunkObjects = speakerChunks.map((text) => ({ text }));
  const allChunks = [...speakerChunkObjects, ...generalChunks];

  if (log) {
    console.log(`3. Total chunks: ${speakerChunkObjects.length} speaker + ${generalChunks.length} general = ${allChunks.length}`);
  }

  // Associate extracted images with ALL chunks
  const chunkImageData = associateImagesWithChunks(allChunks, images);

  if (log) {
    const chunksWithImages = chunkImageData.filter((d) => d.length > 0).length;
    console.log(
      `3.1. Associated images: ${chunksWithImages}/${allChunks.length} chunks have images`,
    );
  }

  const { embeddings } = await embedMany({
    model: customEmbeddingProvider({
      model: process.env.LLM_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
      formalizeData: (values: string[] | string) => values as string,
      log,
    }),
    values: allChunks.map((chunk: any) => chunk.text),
  });

  await cloudflareVectorStore.upsert({
    indexName,
    vectors: embeddings,
    metadata: allChunks.map((chunk: any, index: number) => ({
      text: chunk.text,
      source: url || `html-${indexName}`,
      imageUrls: chunkImageData[index]?.join(IMAGE_URLS_DELIMITER) || '',
    })),
  });

  if (log) {
    console.log(
      `4. All chunks (${allChunks.length}) embedded and upserted successfully!!`,
    );
  }
};
