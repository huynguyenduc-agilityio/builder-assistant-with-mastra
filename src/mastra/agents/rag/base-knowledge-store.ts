import { CloudflareVector } from '@mastra/vectorize';
import { embed } from 'ai';

import { customEmbeddingProvider } from '@/mastra/agents/rag/custom-provider';
import { STATUS_CODE, STATUS_MESSAGES } from '@/mastra/constants';
import { createKnowledgeStoreFromHtml } from './utils/create-knowledge-store';

export type BaseKnowledgeStoreOptions = {
  vector: CloudflareVector;
  indexName: string;
  log?: boolean;
  topK?: number;
};

export class BaseKnowledgeStore {
  protected vector: CloudflareVector;
  protected indexName: string;
  protected log: boolean;
  protected topK: number;

  constructor({
    vector,
    indexName,
    log = false,
    topK = 10,
  }: BaseKnowledgeStoreOptions) {
    this.vector = vector;
    this.indexName = indexName;
    this.log = log;
    this.topK = topK;
  }

  public async createStore(options: { url?: string; html?: string }) {
    const { url, html } = options;

    const source: { url?: string; html?: string } = { url, html };

    if (!source.url && !source.html) {
      throw new Error('No HTML or URL provided to createStoreFromHtml');
    }

    try {
      await createKnowledgeStoreFromHtml({
        ...source,
        indexName: this.indexName,
        cloudflareVectorStore: this.vector,
        log: this.log,
      });
    } catch (error) {
      console.log('create HTML store', error);
      throw new Error(STATUS_MESSAGES[STATUS_CODE.INTERNAL_SERVER_ERROR]);
    }
  }

  public async queryStore({ message }: { message: string }) {
    const { embedding } = await embed({
      value: message,
      model: customEmbeddingProvider({
        model:
          process.env.LLM_EMBEDDING_MODEL || 'openai/text-embedding-3-small',
        formalizeData: (values: string[] | string) => values as string,
        log: this.log,
      }),
    });

    try {
      const results = await this.vector.query({
        indexName: this.indexName,
        queryVector: embedding,
        topK: this.topK,
      });

      if (this.log) console.log(results);
      return results;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public async deleteStore() {
    const existingIndexes = await this.vector.listIndexes();

    if (existingIndexes.includes(this.indexName)) {
      await this.vector.deleteIndex({ indexName: this.indexName });
    }
  }
}
