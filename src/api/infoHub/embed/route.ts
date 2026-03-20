import { InfoHubKnowledgeStore } from '@/mastra/agents/infoHub/info-hub-knowledge-store';
import { API_ROUTES } from '@/mastra/constants';
import { STATUS_CODE } from '@/mastra/constants/status-code';
import { STATUS_MESSAGES } from '@/mastra/constants/status-messages';
import {
  cloudflareVector,
  infoHubStoreIndexName,
} from '@/mastra/storages/cloudflare';

const path = API_ROUTES.INFO_HUB.EMBEDDED;

export const POST = async (c: any) => {
  try {
    const reqLike = c?.req;
    const rawReq: Request | undefined = reqLike?.raw;

    let body: any = {};
    if (typeof reqLike?.json === 'function') {
      body = await reqLike.json();
    } else if (typeof rawReq?.json === 'function') {
      body = await rawReq.json();
    } else if (typeof rawReq?.text === 'function') {
      const text = await rawReq.text();
      body = text ? JSON.parse(text) : {};
    }

    const url = body?.url as string | undefined;
    const indexName = infoHubStoreIndexName;

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'Missing `url` in request body' }),
        {
          status: STATUS_CODE.BAD_REQUEST,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const store = new InfoHubKnowledgeStore({
      vector: cloudflareVector,
      indexName,
    });

    await store.createStore({
      url,
    });

    return new Response(
      JSON.stringify({
        message: 'Indexed website successfully!',
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
