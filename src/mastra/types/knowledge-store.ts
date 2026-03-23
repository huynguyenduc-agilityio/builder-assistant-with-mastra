import type { CloudflareVector } from '@mastra/vectorize';

export type ExtractedImage = {
  src: string;
  alt: string;
  filename: string;
};

export type SpeakerEntry = {
  name: string;
  role: string;
  company: string;
  topic: string;
  language: string;
};

export type CreateKnowledgeStoreFromHtmlParams = {
  url?: string;
  html?: string;
  indexName: string;
  cloudflareVectorStore: CloudflareVector;
  log?: boolean;
};
