export interface SpeakerInfo {
  role?: string;
  company?: string;
  avatar?: string;
}

export interface RatingCardProps {
  target: string;
  name: string;
  rating: number;
  reviewerName?: string;
  status: 'inProgress' | 'executing' | 'complete';
  speakerInfo?: SpeakerInfo;
}

export interface InteractiveRatingCardProps {
  target: string;
  name: string;
  reviewerName: string;
  userId: string;
  email: string;
  onSubmit: (result: string) => void;
  onCancel: (result: string) => void;
  speakerInfo?: SpeakerInfo;
}

export interface StatsCardProps {
  status: 'inProgress' | 'executing' | 'complete';
  result?: string;
  speakerInfo?: SpeakerInfo;
}
