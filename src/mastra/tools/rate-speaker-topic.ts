import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

import { INFO_HUB_PROMPT } from '../constants/infoHub/prompts';
import { SPEAKER_NAME, TOPIC_NAME } from '@/constants';
import { submitRating, buildRatingStats } from '@/lib/ratings-service';

export const rateSpeakerTopicTool = createTool({
  id: INFO_HUB_PROMPT.rateSpeakerTopicTool.key,
  description: INFO_HUB_PROMPT.rateSpeakerTopicTool.description,
  inputSchema: z.object({
    target: z
      .enum(['speaker', 'topic'])
      .describe(
        'What the user is rating: "speaker" for Huy Nguyen Duc, or "topic" for the session topic',
      ),
    rating: z
      .number()
      .min(1)
      .max(5)
      .optional()
      .describe('Rating from 1 to 5 stars (collected via interactive card)'),

    userId: z
      .string()
      .optional()
      .describe('The Firebase UID of the logged-in reviewer'),
    userName: z
      .string()
      .optional()
      .describe('The display name of the logged-in reviewer'),
    email: z
      .string()
      .optional()
      .describe('The email of the logged-in reviewer'),
  }),
  execute: async ({ target, rating, userId, userName, email }) => {
    return await rateSpeakerTopicExecute({
      target,
      rating,
      userId,
      userName,
      email,
    });
  },
});

export const getRatingStatsTool = createTool({
  id: INFO_HUB_PROMPT.getRatingStatsTool.key,
  description: INFO_HUB_PROMPT.getRatingStatsTool.description,
  inputSchema: z.object({
    target: z
      .enum(['speaker', 'topic', 'all'])
      .optional()
      .describe(
        'Which ratings to retrieve stats for: "speaker", "topic", or "all" for both',
      ),
  }),
  execute: async ({ target }) => {
    return await getRatingStatsExecute({ target: target || 'all' });
  },
});

const rateSpeakerTopicExecute = async ({
  target,
  rating,
  userId,
  userName,
  email,
}: {
  target: 'speaker' | 'topic';
  rating?: number;
  userId?: string;
  userName?: string;
  email?: string;
}) => {
  try {
    const resolvedName =
      target === 'speaker' ? SPEAKER_NAME : TOPIC_NAME;
    const clampedRating = Math.round(Math.min(5, Math.max(1, rating || 5)));
    const resolvedUserName = userName || 'Anonymous';

    // Submit to Firestore
    const { entry, isUpdate } = await submitRating({
      type: target,
      name: resolvedName,
      rating: clampedRating,
      userId,
      userName,
      email,
    });

    // Get updated summary from Firestore
    const stats = await buildRatingStats(target, resolvedName);

    return JSON.stringify({
      success: true,
      message: isUpdate
        ? `Your rating for ${target} "${resolvedName}" has been updated to ${clampedRating} star${clampedRating !== 1 ? 's' : ''}!`
        : `Thank you, ${resolvedUserName}! You rated ${target} "${resolvedName}" ${clampedRating} star${clampedRating !== 1 ? 's' : ''}.`,
      rating: entry,
      summary: {
        target,
        name: resolvedName,
        averageRating: stats.averageRating,
        totalReviewers: stats.totalReviewers,
      },
    });
  } catch (error: unknown) {
    console.error('rateSpeakerTopicExecute error:', error);
    return JSON.stringify({
      success: false,
      message: 'Failed to submit rating. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const getRatingStatsExecute = async ({
  target,
}: {
  target: 'speaker' | 'topic' | 'all';
}) => {
  try {
    if (target === 'all') {
      const [speakerStats, topicStats] = await Promise.all([
        buildRatingStats('speaker', SPEAKER_NAME),
        buildRatingStats('topic', TOPIC_NAME),
      ]);

      return JSON.stringify({
        success: true,
        speaker: speakerStats,
        topic: topicStats,
      });
    }

    const name = target === 'speaker' ? SPEAKER_NAME : TOPIC_NAME;
    const stats = await buildRatingStats(target, name);

    return JSON.stringify({
      success: true,
      ...stats,
    });
  } catch (error: unknown) {
    console.error('getRatingStatsExecute error:', error);
    return JSON.stringify({
      success: false,
      message: 'Failed to retrieve rating stats.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
