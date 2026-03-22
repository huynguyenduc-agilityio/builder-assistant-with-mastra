import type { RatingCardProps } from '@/types';

export const RatingCard = ({
  target,
  name,
  rating,
  reviewerName,
  status,
}: RatingCardProps) => {
  const isLoading = status !== 'complete';

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        maxWidth: '380px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: 'relative' as const,
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200px',
          height: '200px',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
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
        {isLoading && (
          <span
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontStyle: 'italic',
            }}
          >
            Submitting...
          </span>
        )}
      </div>

      {/* Name */}
      <h3
        style={{
          margin: '0 0 14px 0',
          fontSize: '18px',
          fontWeight: 700,
          color: '#e2e8f0',
          lineHeight: 1.3,
        }}
      >
        {name || 'Loading...'}
      </h3>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: '24px',
              filter:
                star <= rating ? 'none' : 'grayscale(1) opacity(0.3)',
              transition: 'all 0.3s ease',
              transform: star <= rating ? 'scale(1)' : 'scale(0.85)',
            }}
          >
            ⭐
          </span>
        ))}
        <span
          style={{
            marginLeft: '8px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#fbbf24',
            alignSelf: 'center',
          }}
        >
          {rating}/5
        </span>
      </div>

      {/* Reviewer */}
      {reviewerName && (
        <p
          style={{
            margin: '0 0 10px 0',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          Reviewed by <strong style={{ color: '#a5b4fc' }}>{reviewerName}</strong>
        </p>
      )}

      {/* Status footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isLoading ? '#fbbf24' : '#34d399',
            boxShadow: isLoading
              ? '0 0 8px rgba(251, 191, 36, 0.5)'
              : '0 0 8px rgba(52, 211, 153, 0.5)',
          }}
        />
        <span
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 500,
          }}
        >
          {isLoading ? 'Processing rating...' : 'Rating submitted ✓'}
        </span>
      </div>
    </div>
  );
};
