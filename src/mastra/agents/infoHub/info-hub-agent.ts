import { D1Store } from '@mastra/cloudflare-d1';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

import { INFO_HUB_PROMPT } from '../../constants';
import {
  queryInfoDataTool,
  rateTool,
  getRatingStatsTool,
} from '@/mastra/tools';

export const infoHubAgent = (storage: D1Store) =>
  new Agent({
    id: 'info-hub-agent',
    name: 'Info Hub Agent',
    instructions: INFO_HUB_PROMPT.instruction(),
    model: process.env.LLM_MODEL || 'openrouter/openai/gpt-4o-mini',
    tools: {
      queryInfoDataTool,
      rateTool,
      getRatingStatsTool,
    },
    memory: new Memory({ storage }),
  });
