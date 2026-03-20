import { D1Store } from '@mastra/cloudflare-d1';
import { CloudflareVector } from '@mastra/vectorize';

export const createStorage = () =>
  new D1Store({
    id: 'cloudflare-d1',
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
    apiToken: process.env.CLOUDFLARE_API_TOKEN!,
    tablePrefix: process.env.CLOUDFLARE_DB_PREFIX,
  });

export const cloudflareVector = new CloudflareVector({
  ...{ id: process.env.CLOUDFLARE_ACCOUNT_ID! },
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  apiToken: process.env.CLOUDFLARE_API_TOKEN!,
});

export const infoHubStoreIndexName =
  process.env.CLOUDFLARE_VECTORIZE_INFO_HUB_INDEX || '';
