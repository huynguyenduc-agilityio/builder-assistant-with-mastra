import { MDocument } from '@mastra/rag';

export const chunkDocFromText = async (
  textData: string,
  log = true,
): Promise<any[]> => {
  // Create document and chunk it
  const doc = MDocument.fromText(textData);
  const chunks = await doc.chunk({
    strategy: 'recursive',
    maxSize: 512,
    overlap: 100,
    separators: ['\n\n', '\n', ' '],
  });

  if (log) {
    console.log('Number of chunks:', chunks.length);
  }

  return chunks;
};
