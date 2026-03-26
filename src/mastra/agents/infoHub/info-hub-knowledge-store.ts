import type { CloudflareVector } from '@mastra/vectorize';

import { infoHubStoreIndexName } from '../../storages';
import { BaseKnowledgeStore } from '../rag/base-knowledge-store';

export type InfoHubStoreOptions = {
  vector: CloudflareVector;
  indexName?: string;
  log?: boolean;
  topK?: number;
};

export class InfoHubKnowledgeStore extends BaseKnowledgeStore {
  constructor({
    vector,
    indexName,
    log = false,
    topK = 10,
  }: InfoHubStoreOptions) {
    super({
      vector,
      indexName: indexName || infoHubStoreIndexName,
      log,
      topK,
    });
  }
}
