import type { GroupedSpeaker, SpeakerData } from '@/types';

export const groupSpeakers = (data: SpeakerData[]): GroupedSpeaker[] => {
  const map = new Map<string, GroupedSpeaker>();

  for (const item of data) {
    const key = `${item.name}__${item.company}`;
    if (!map.has(key)) {
      map.set(key, {
        name: item.name,
        role: item.role,
        company: item.company,
        avatar: item.avatar,
        topics: [],
      });
    }
    const entry = map.get(key)!;
    if (item.topic && !entry.topics.includes(item.topic)) {
      entry.topics.push(item.topic);
    }
  }

  return Array.from(map.values());
};

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
