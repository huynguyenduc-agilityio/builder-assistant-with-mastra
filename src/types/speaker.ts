export interface SpeakerData {
  name: string;
  role: string;
  company: string;
  topic: string;
  avatar?: string;
}

export interface SpeakerQueryResult {
  type: 'speaker';
  data: SpeakerData[];
}

export interface GroupedSpeaker {
  name: string;
  role: string;
  company: string;
  avatar?: string;
  topics: string[];
}
