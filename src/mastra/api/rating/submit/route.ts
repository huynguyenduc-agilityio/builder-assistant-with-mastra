import { API_ROUTES, STATUS_CODE, STATUS_MESSAGES } from '@/mastra/constants';
import { submitRating, getRatingSummary } from '@/lib/ratings-service';

export type { RatingEntry } from '@/lib/ratings-service';

const path = API_ROUTES.RATING.BASE;

export const POST = async (c: any) => {
  try {
    const body = await c.req.json();

    const { type, name, rating, userId, userName, email } = body;

    if (!type || !name || !rating) {
      return c.json(
        { error: 'Missing required fields: type, name, rating' },
        STATUS_CODE.BAD_REQUEST,
      );
    }

    if (!['speaker', 'topic'].includes(type)) {
      return c.json(
        { error: 'Invalid type. Must be "speaker" or "topic".' },
        STATUS_CODE.BAD_REQUEST,
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return c.json(
        { error: 'Rating must be a number between 1 and 5.' },
        STATUS_CODE.BAD_REQUEST,
      );
    }

    // Submit rating to Firestore
    const { entry, isUpdate } = await submitRating({
      type,
      name,
      rating,
      userId,
      userName,
      email,
    });

    // Compute summary
    const summary = await getRatingSummary(type);

    return c.json({
      message: isUpdate
        ? 'Rating updated successfully!'
        : 'Rating submitted successfully!',
      rating: entry,
      summary: {
        name: entry.name,
        type: entry.type,
        averageRating: summary.averageRating,
        totalReviewers: summary.totalReviewers,
      },
    });
  } catch (err) {
    console.error(`rating submit route ${path} error:`, err);
    return c.json(
      { error: STATUS_MESSAGES[STATUS_CODE.INTERNAL_SERVER_ERROR] },
      STATUS_CODE.INTERNAL_SERVER_ERROR,
    );
  }
};
