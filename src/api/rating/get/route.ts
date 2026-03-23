import { API_ROUTES, STATUS_CODE, STATUS_MESSAGES } from '@/mastra/constants';
import { getRatings, getRatingSummary } from '@/lib/ratings-service';

const path = API_ROUTES.RATING.GET;

export const GET = async (c: any) => {
  try {
    const reqLike = c?.req;
    const rawReq: Request | undefined = reqLike?.raw;

    const url = new URL(
      rawReq?.url || reqLike?.url || 'http://localhost:4750',
    );
    const type = url.searchParams.get('type') as
      | 'speaker'
      | 'topic'
      | null;
    const name = url.searchParams.get('name');

    // Build filter
    const filter: { type?: 'speaker' | 'topic'; name?: string } = {};
    if (type) filter.type = type;
    if (name) filter.name = name;

    // Fetch from Firestore
    const ratings = await getRatings(Object.keys(filter).length > 0 ? filter : undefined);

    // Get summary if type is specified
    let summary = null;
    if (type) {
      summary = await getRatingSummary(type);
    }

    return c.json({
      success: true,
      ratings,
      total: ratings.length,
      ...(summary ? { summary } : {}),
    });
  } catch (err) {
    console.error(`rating get route ${path} error:`, err);
    return c.json(
      { error: STATUS_MESSAGES[STATUS_CODE.INTERNAL_SERVER_ERROR] },
      STATUS_CODE.INTERNAL_SERVER_ERROR,
    );
  }
};
