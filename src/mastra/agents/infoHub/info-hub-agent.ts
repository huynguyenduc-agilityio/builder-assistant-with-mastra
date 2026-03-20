import { D1Store } from '@mastra/cloudflare-d1';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

import { INFO_HUB_PROMPT } from '../../constants';
import { queryInfoDataTool } from '@/mastra/tools';

export const infoHubAgent = (storage: D1Store) =>
  new Agent({
    id: 'info-hub-agent',
    name: 'Info Hub Agent',
    instructions: INFO_HUB_PROMPT.instruction(),
    model: 'openai/gpt-4o-mini',
    tools: {
      queryInfoDataTool,
    },
    memory: new Memory({ storage }),
  });
