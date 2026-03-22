import { useState } from 'react';
import { MASTRA_BASE_URL, RATING_LABELS } from '@/constants';

import type { InteractiveRatingCardProps } from '@/types';

export const InteractiveRatingCard = ({
  target,
  name,
  reviewerName,
  userId,
  email,
  onSubmit,
  onCancel,
}: InteractiveRatingCardProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const displayRating = hoveredRating || selectedRating;

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      setError('Please select a rating (1-5 stars)');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const payload = {
      type: target,
      name,
      rating: selectedRating,
      userId,
      userName: reviewerName,
      email,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${MASTRA_BASE_URL}/rating/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errBody = await res.text();
        console.error('Rating submit failed:', res.status, errBody);
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      onSubmit(
        JSON.stringify({
          success: true,
          message: `${reviewerName} rated ${target} "${name}" ${selectedRating} star${selectedRating !== 1 ? 's' : ''}.`,
          rating: selectedRating,
          summary: data.summary,
        }),
      );
    } catch (err) {
      console.error('Rating submit error:', err);
      // Even if the API call fails, still submit the rating result
      // so the agent can continue the conversation
      onSubmit(
        JSON.stringify({
          success: true,
          message: `${reviewerName} rated ${target} "${name}" ${selectedRating} star${selectedRating !== 1 ? 's' : ''}.`,
          rating: selectedRating,
        }),
      );
    }
  };

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 20px rgba(99, 102, 241, 0.1)',
        maxWidth: '420px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: 'relative' as const,
        overflow: 'hidden',
      }}
    >
      {/* Animated top border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background:
            'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #6366f1)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
        }}
      />

      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200px',
          height: '200px',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Badge row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            background:
              target === 'speaker'
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
          }}
        >
          {target === 'speaker' ? '🎤 Speaker' : '📋 Topic'}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontStyle: 'italic',
          }}
        >
          by {reviewerName}
        </span>
      </div>

      {/* Target name */}
      <h3
        style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: 700,
          color: '#e2e8f0',
          lineHeight: 1.3,
        }}
      >
        {name}
      </h3>

      {/* Star picker */}
      <div style={{ marginBottom: '16px' }}>
        <p
          style={{
            margin: '0 0 10px 0',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.06em',
            fontWeight: 600,
          }}
        >
          Your Rating
        </p>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '32px',
                padding: '2px',
                transition: 'all 0.15s ease',
                filter:
                  star <= displayRating
                    ? 'none'
                    : 'grayscale(1) opacity(0.25)',
                transform:
                  star <= displayRating ? 'scale(1.15)' : 'scale(0.9)',
              }}
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              ⭐
            </button>
          ))}
          {displayRating > 0 && (
            <span
              style={{
                marginLeft: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#fbbf24',
                minWidth: '80px',
              }}
            >
              {displayRating}/5 — {RATING_LABELS[displayRating]}
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: '12px',
            color: '#f87171',
            fontWeight: 500,
          }}
        >
          ⚠️ {error}
        </p>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedRating === 0}
          style={{
            flex: 1,
            padding: '11px 16px',
            borderRadius: '10px',
            border: 'none',
            background:
              isSubmitting || selectedRating === 0
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg, #34d399, #10b981)',
            color:
              isSubmitting || selectedRating === 0
                ? 'rgba(255,255,255,0.3)'
                : '#fff',
            fontSize: '13px',
            fontWeight: 700,
            cursor:
              isSubmitting || selectedRating === 0
                ? 'not-allowed'
                : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow:
              selectedRating > 0 && !isSubmitting
                ? '0 4px 14px rgba(52, 211, 153, 0.3)'
                : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          {isSubmitting ? '⏳ Submitting...' : '✅ Submit Rating'}
        </button>
        <button
          onClick={() => onCancel(JSON.stringify({ cancelled: true, message: 'The user chose not to rate at this time.' }))}
          disabled={isSubmitting}
          style={{
            padding: '11px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Cancel
        </button>
      </div>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
