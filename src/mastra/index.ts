import { Mastra } from '@mastra/core/mastra';
import { ConsoleLogger, LogLevel } from '@mastra/core/logger';
import { registerCopilotKit } from '@ag-ui/mastra/copilotkit';
import { registerApiRoute } from '@mastra/core/server';

import { createStorage } from './storages';
import { API_ROUTES } from './constants';
import { POST as infoHubEmbedPost } from '@/mastra/api/infoHub/embed/route';
import { POST as infoHubDeletePost } from '@/mastra/api/infoHub/delete/route';
import { POST as ratingSubmitPost } from '@/mastra/api/rating/submit/route';
import { GET as ratingGetHandler } from '@/mastra/api/rating/get/route';
import { infoHubAgent } from './agents/infoHub/info-hub-agent';

const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || 'debug';

export const mastra = new Mastra({
  agents: {
    infoHubAgent: infoHubAgent(createStorage()),
  },
  storage: createStorage(),
  logger: new ConsoleLogger({
    level: LOG_LEVEL,
  }),
  server: {
    port: Number(process.env.PORT) || 4750,
    host: '0.0.0.0',
    cors: {
      origin: '*',
      allowMethods: ['*'],
      allowHeaders: ['*'],
    },
    apiRoutes: [
      registerApiRoute(API_ROUTES.INFO_HUB.EMBED, {
        method: 'POST',
        handler: async (c: any) => {
          return infoHubEmbedPost(c);
        },
      }),
      registerApiRoute(API_ROUTES.INFO_HUB.BASE, {
        method: 'DELETE',
        handler: async () => {
          return infoHubDeletePost();
        },
      }),
      registerApiRoute(API_ROUTES.RATING.BASE, {
        method: 'POST',
        handler: async (c: any) => {
          return ratingSubmitPost(c);
        },
      }),
      registerApiRoute(API_ROUTES.RATING.BASE, {
        method: 'GET',
        handler: async (c: any) => {
          return ratingGetHandler(c);
        },
      }),
      registerCopilotKit({
        path: '/copilotkit',
        resourceId: 'copilotkit-resource',
      }),
    ],
  },
});
