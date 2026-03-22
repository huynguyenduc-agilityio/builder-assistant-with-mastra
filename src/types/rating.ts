export interface RatingCardProps {
  target: string;
  name: string;
  rating: number;
  reviewerName?: string;
  status: 'inProgress' | 'executing' | 'complete';
}

export interface InteractiveRatingCardProps {
  target: string;
  name: string;
  reviewerName: string;
  userId: string;
  email: string;
  onSubmit: (result: string) => void;
  onCancel: (result: string) => void;
}

export interface StatsCardProps {
  status: 'inProgress' | 'executing' | 'complete';
  result?: string;
}
