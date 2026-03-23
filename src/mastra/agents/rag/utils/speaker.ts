import type { SpeakerEntry } from '@/mastra/types';
import {
  ROOM_PATTERN,
  LANG_PATTERN,
  TIME_PATTERN,
  PANEL_DISCUSSION_PATTERN,
} from '@/mastra/constants';

/**
 * Parse the AGENDA section text to extract structured speaker-topic entries.
 * Each speaker gets their own chunk: "Speaker: X | Role: Y | Company: Z | Topic: T"
 *
 * This ensures each speaker is isolated in their own vector embedding,
 * preventing cross-contamination during semantic search.
 */
export const extractStructuredSpeakerChunks = (text: string): string[] => {
  const entries: SpeakerEntry[] = [];

  const lines = text.split(/\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    if (ROOM_PATTERN.test(line) && i + 4 < lines.length) {
      const lang = lines[i + 1]?.trim() || '';
      if (LANG_PATTERN.test(lang)) {
        const company = lines[i + 2]?.trim() || '';
        const name = lines[i + 3]?.trim() || '';
        const role = lines[i + 4]?.trim() || '';
        const topic = lines[i + 5]?.trim() || '';

        if (name && !ROOM_PATTERN.test(name) && !LANG_PATTERN.test(name) && !TIME_PATTERN.test(name)) {
          entries.push({ name, role, company, topic, language: lang });
        }
      }
    }
  }

  const panelRegex = new RegExp(PANEL_DISCUSSION_PATTERN.source, PANEL_DISCUSSION_PATTERN.flags);
  let panelMatch;
  const fullText = text.replace(/\r\n/g, '\n');

  while ((panelMatch = panelRegex.exec(fullText)) !== null) {
    const panelTopic = panelMatch[1]?.trim();
    const panelLines = panelMatch[2]?.split('\n').filter((l) => l.trim());

    if (panelTopic && panelLines) {
      for (let j = 0; j < panelLines.length; j += 2) {
        const name = panelLines[j]?.trim();
        const roleCompany = panelLines[j + 1]?.trim();
        if (name && roleCompany) {
          const atIdx = roleCompany.lastIndexOf(' at ');
          const role = atIdx > -1 ? roleCompany.substring(0, atIdx) : roleCompany;
          const company = atIdx > -1 ? roleCompany.substring(atIdx + 4) : '';
          entries.push({ name, role, company, topic: `Panel: ${panelTopic}`, language: 'EN' });
        }
      }
    }
  }

  return entries.map((e) =>
    [
      `Speaker: ${e.name}`,
      `Role: ${e.role}`,
      `Company: ${e.company}`,
      `Topic: ${e.topic}`,
      `Language: ${e.language}`,
    ].join(' | '),
  );
};
