import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

import { ghibliCharacters, ghibliFilms } from '../tools';

export const ghibliAgent = new Agent({
  id: 'ghibli-agent',
  name: 'Ghibli Agent',
  description:
    'This agent answers questions about Studio Ghibli films and characters.',
  instructions:
    "You are my Ghibli Films assistant. I will ask you questions and you must use the two tools ghibliFilms and ghibliCharacters to answer my questions. Always use the tools to get information about Studio Ghibli films and characters. If you don't know the answer, say 'I don't know'.",
  model: [
    {
      model: 'openai/gpt-4o-mini',
    },
  ],
  tools: { ghibliFilms, ghibliCharacters },
  memory: new Memory({
    options: {
      generateTitle: true,
    },
  }),
});
