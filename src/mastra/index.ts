import { registerCopilotKit } from '@ag-ui/mastra/copilotkit';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';

import { ghibliAgent } from './agents';

export const mastra = new Mastra({
  agents: {
    ghibliAgent,
  },
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: ':memory:',
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  bundler: {
    externals: ['@copilotkit/runtime'],
  },
  server: {
    port: 4750,
    cors: {
      origin: '*',
      allowMethods: ['*'],
      allowHeaders: ['*'],
    },
    apiRoutes: [
      registerCopilotKit({
        path: '/copilotkit',
        resourceId: 'copilotkit-resource',
      }),
    ],
  },
});
