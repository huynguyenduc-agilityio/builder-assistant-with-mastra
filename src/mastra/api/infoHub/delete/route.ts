import { InfoHubKnowledgeStore } from '@/mastra/agents/infoHub/info-hub-knowledge-store';
import { API_ROUTES, STATUS_CODE, STATUS_MESSAGES } from '@/mastra/constants';
import { cloudflareVector, infoHubStoreIndexName } from '@/mastra/storages';

const path = API_ROUTES.INFO_HUB.BASE;

export const POST = async () => {
  try {
    const indexName = infoHubStoreIndexName;

    const store = new InfoHubKnowledgeStore({
      vector: cloudflareVector,
      indexName,
    });

    await store.deleteStore();

    return new Response(
      JSON.stringify({
        message: 'Delete index successfully!',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    console.error(`embed route ${path} error:`, err);
    return new Response(
      JSON.stringify({
        error: STATUS_MESSAGES[STATUS_CODE.INTERNAL_SERVER_ERROR],
      }),
      {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
