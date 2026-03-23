import { adminDb } from './firebase-admin';

const RATINGS_COLLECTION = 'ratings';

export interface RatingEntry {
  id: string;
  type: 'speaker' | 'topic';
  name: string;
  rating: number;
  userId: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Submit or update a rating.
 * Each user can only have one rating per target type (speaker/topic).
 * If the user has already rated, their previous rating is updated.
 */
export async function submitRating(data: {
  type: 'speaker' | 'topic';
  name: string;
  rating: number;
  userId?: string;
  userName?: string;
  email?: string;
}): Promise<{ entry: RatingEntry; isUpdate: boolean }> {
  const { type, name, rating, userId, userName, email } = data;

  const resolvedUserId = userId || 'anonymous';
  const resolvedUserName = userName || 'Anonymous';
  const resolvedEmail = email || '';
  const clampedRating = Math.round(Math.min(5, Math.max(1, rating)));

  const collection = adminDb.collection(RATINGS_COLLECTION);

  // Check for existing rating from this user for this type
  const existingSnapshot = await collection
    .where('userId', '==', resolvedUserId)
    .where('type', '==', type)
    .limit(1)
    .get();

  const now = new Date().toISOString();
  let entry: RatingEntry;
  let isUpdate = false;

  if (!existingSnapshot.empty) {
    // Update existing rating
    const existingDoc = existingSnapshot.docs[0];
    const existingData = existingDoc.data() as RatingEntry;

    entry = {
      ...existingData,
      name: name.trim(),
      rating: clampedRating,
      userName: resolvedUserName,
      email: resolvedEmail,
      updatedAt: now,
    };

    await existingDoc.ref.update({
      name: entry.name,
      rating: entry.rating,
      userName: entry.userName,
      email: entry.email,
      updatedAt: entry.updatedAt,
    });

    isUpdate = true;
  } else {
    // Create new rating
    const docId = `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    entry = {
      id: docId,
      type,
      name: name.trim(),
      rating: clampedRating,
      userId: resolvedUserId,
      userName: resolvedUserName,
      email: resolvedEmail,
      createdAt: now,
      updatedAt: now,
    };

    await collection.doc(docId).set(entry);
  }

  return { entry, isUpdate };
}

/**
 * Get all ratings, optionally filtered by type and/or name.
 */
export async function getRatings(filter?: {
  type?: 'speaker' | 'topic';
  name?: string;
}): Promise<RatingEntry[]> {
  const collection = adminDb.collection(RATINGS_COLLECTION);

  let query: FirebaseFirestore.Query = collection;

  if (filter?.type) {
    query = query.where('type', '==', filter.type);
  }
  if (filter?.name) {
    query = query.where('name', '==', filter.name);
  }

  const snapshot = await query.get();

  const ratings = snapshot.docs.map((doc) => doc.data() as RatingEntry);

  // Sort in memory to avoid Firestore composite index requirement
  return ratings.sort((a, b) =>
    (b.createdAt || '').localeCompare(a.createdAt || ''),
  );
}

/**
 * Compute rating summary for a given type.
 */
export async function getRatingSummary(type: 'speaker' | 'topic') {
  const ratings = await getRatings({ type });
  const totalReviewers = ratings.length;
  const averageRating =
    totalReviewers > 0
      ? Math.round(
          (ratings.reduce((sum, r) => sum + r.rating, 0) / totalReviewers) * 10,
        ) / 10
      : 0;

  return {
    type,
    averageRating,
    totalReviewers,
  };
}

/**
 * Build full stats for a target type (for the stats tool).
 */
export async function buildRatingStats(type: 'speaker' | 'topic', name: string) {
  const ratings = await getRatings({ type });
  const totalReviewers = ratings.length;
  const averageRating =
    totalReviewers > 0
      ? Math.round(
          (ratings.reduce((sum, r) => sum + r.rating, 0) / totalReviewers) * 10,
        ) / 10
      : 0;

  // Distribution of stars
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratings.forEach((r) => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });

  // Recent reviews (last 5)
  const recentReviews = ratings
    .slice(0, 5)
    .map((r) => ({
      userName: r.userName,
      rating: r.rating,
      date: r.updatedAt || r.createdAt,
    }));

  return {
    type,
    name,
    totalReviewers,
    averageRating,
    distribution,
    recentReviews,
  };
}
