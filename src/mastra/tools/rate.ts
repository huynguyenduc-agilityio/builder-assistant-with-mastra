import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

import { INFO_HUB_PROMPT } from '../constants/infoHub/prompts';
import { submitRating, buildRatingStats } from '@/lib/ratings-service';

export const rateTool = createTool({
  id: INFO_HUB_PROMPT.rateTool.key,
  description: INFO_HUB_PROMPT.rateTool.description,
  inputSchema: z.object({
    target: z
      .enum(['speaker', 'topic'])
      .describe(
        'What the user is rating: "speaker" for a speaker, or "topic" for a session topic',
      ),
    name: z
      .string()
      .describe(
        'The name of the speaker or topic that the user wants to rate (provided dynamically by the user)',
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
  execute: async ({ target, name, rating, userId, userName, email }) => {
    return await rateSpeakerTopicExecute({
      target,
      name,
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
      .enum(['speaker', 'topic'])
      .optional()
      .describe(
        'What to retrieve stats for: "speaker" or "topic"',
      ),
    name: z
      .string()
      .optional()
      .describe(
        'The speaker or topic name to retrieve rating stats for.',
      ),
  }),
  execute: async ({ target, name }) => {
    return await getRatingStatsExecute({ target, name });
  },
});

const rateSpeakerTopicExecute = async ({
  target,
  name,
  rating,
  userId,
  userName,
  email,
}: {
  target: 'speaker' | 'topic';
  name: string;
  rating?: number;
  userId?: string;
  userName?: string;
  email?: string;
}) => {
  try {
    const clampedRating = Math.round(Math.min(5, Math.max(1, rating || 5)));
    const resolvedUserName = userName || 'Anonymous';
    const targetLabel = target === 'speaker' ? 'speaker' : 'topic';

    // Submit to Firestore
    const { entry, isUpdate } = await submitRating({
      type: target,
      name,
      rating: clampedRating,
      userId,
      userName,
      email,
    });

    // Get updated summary from Firestore
    const stats = await buildRatingStats(target, name);

    return JSON.stringify({
      success: true,
      message: isUpdate
        ? `Your rating for ${targetLabel} "${name}" has been updated to ${clampedRating} star${clampedRating !== 1 ? 's' : ''}!`
        : `Thank you, ${resolvedUserName}! You rated ${targetLabel} "${name}" ${clampedRating} star${clampedRating !== 1 ? 's' : ''}.`,
      rating: entry,
      summary: {
        target,
        name,
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
  name,
}: {
  target?: 'speaker' | 'topic';
  name?: string;
}) => {
  try {
    if (target && name) {
      const stats = await buildRatingStats(target, name);

      return JSON.stringify({
        success: true,
        ...stats,
      });
    }

    // If missing info, return a message asking for details
    return JSON.stringify({
      success: false,
      message: 'Please specify the speaker or topic name you want to see ratings for.',
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
