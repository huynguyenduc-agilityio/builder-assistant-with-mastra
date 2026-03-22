export const SPEAKER_NAME = 'Huy Nguyen Duc';
export const TOPIC_NAME =
  'Building a Full-Stack AI Assistant with TypeScript';

export const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export const CHAT_SUGGESTIONS: { title: string; message: string }[] = [
  {
    title: '⭐ Rate the speaker',
    message: `I want to rate the speaker ${SPEAKER_NAME}`,
  },
  {
    title: '📝 Rate the topic',
    message: `I want to rate the topic "${TOPIC_NAME}"`,
  },
  {
    title: '📊 View ratings',
    message: 'How many people have reviewed and what is the average rating?',
  },
];
