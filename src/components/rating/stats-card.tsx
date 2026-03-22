import type { StatsCardProps } from '@/types';

export const StatsCard = ({ status, result }: StatsCardProps) => {
  const isLoading = status !== 'complete';

  if (isLoading) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '420px',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '14px',
        }}
      >
        📊 Loading rating statistics...
      </div>
    );
  }

  let parsed: any = null;
  try {
    parsed = JSON.parse(result || '{}');
  } catch {
    return null;
  }

  if (!parsed?.success) return null;

  const sections: { type: string; name: string; totalReviewers: number; averageRating: number; distribution?: Record<string, number>; recentReviews?: any[] }[] = [];

  if (parsed.speaker) sections.push(parsed.speaker);
  if (parsed.topic) sections.push(parsed.topic);
  if (!parsed.speaker && !parsed.topic && parsed.type) sections.push(parsed);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
        maxWidth: '420px',
      }}
    >
      {sections.map((section, idx) => (
        <div
          key={idx}
          style={{
            background:
              'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            position: 'relative' as const,
            overflow: 'hidden',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                background:
                  section.type === 'speaker'
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
              {section.type === 'speaker' ? '🎤 Speaker' : '📋 Topic'}
            </span>
          </div>

          {/* Name */}
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 700,
              color: '#e2e8f0',
              lineHeight: 1.3,
            }}
          >
            {section.name}
          </h3>

          {/* Big Stats */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '16px',
            }}
          >
            <div style={{ textAlign: 'center' as const }}>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#fbbf24',
                  lineHeight: 1,
                }}
              >
                {section.averageRating || '—'}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginTop: '4px',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                }}
              >
                Avg Rating
              </div>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#818cf8',
                  lineHeight: 1,
                }}
              >
                {section.totalReviewers}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginTop: '4px',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                }}
              >
                Reviewers
              </div>
            </div>
          </div>

          {/* Star Distribution */}
          {section.distribution && (
            <div style={{ marginBottom: '14px' }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count =
                  (section.distribution as Record<string, number>)?.[
                  String(star)
                  ] || 0;
                const pct =
                  section.totalReviewers > 0
                    ? (count / section.totalReviewers) * 100
                    : 0;
                return (
                  <div
                    key={star}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.6)',
                        width: '10px',
                      }}
                    >
                      {star}
                    </span>
                    <span style={{ fontSize: '12px' }}>⭐</span>
                    <div
                      style={{
                        flex: 1,
                        height: '8px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background:
                            'linear-gradient(90deg, #fbbf24, #f59e0b)',
                          borderRadius: '4px',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.4)',
                        width: '20px',
                        textAlign: 'right' as const,
                      }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recent Reviews */}
          {section.recentReviews && section.recentReviews.length > 0 && (
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '12px',
              }}
            >
              <p
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                }}
              >
                Recent Reviews
              </p>
              {section.recentReviews.map((review: any, i: number) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#a5b4fc',
                      }}
                    >
                      {review.userName}
                    </span>
                    <span style={{ fontSize: '12px' }}>
                      {'⭐'.repeat(review.rating)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {section.totalReviewers === 0 && (
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: 'rgba(255,255,255,0.4)',
                fontStyle: 'italic',
              }}
            >
              No reviews yet. Be the first to rate!
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
