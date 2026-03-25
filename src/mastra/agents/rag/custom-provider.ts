import type { EmbeddingModel } from 'ai';

export const customEmbeddingProvider = ({
  model,
  formalizeData,
  log = true,
}: {
  model: string;
  formalizeData: (value: string | string[]) => string;
  log?: boolean;
}) =>
  ({
    specificationVersion: 'v2',
    modelId: model,
    maxEmbeddingsPerCall: 512,
    supportsParallelCalls: true,
    provider: '',
    doEmbed: async (values) => {
      const input = formalizeData(
        typeof values.values === 'object' ? values.values : values.values[0],
      );

      if (log) {
        console.log('Raw input', input);
      }

      const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          input,
          model: model,
          encoding_format: 'float',
        }),
      });
      const data = await response.json();

      if (log) {
        console.log('Embedded data', data);
      }

      if (!data.data) {
        console.error(
          '[customEmbeddingProvider] Embedding API error:',
          JSON.stringify(data),
        );
        throw new Error(
          `Embedding API failed: ${data.error?.message || JSON.stringify(data)}`,
        );
      }

      return {
        embeddings: data.data.map((item: { embedding: any }) => item.embedding),
      };
    },
  }) as EmbeddingModel<string>;
