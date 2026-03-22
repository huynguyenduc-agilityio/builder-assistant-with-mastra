import { CopilotChat } from '@copilotkit/react-ui';
import { CopilotKit, useCopilotAction } from '@copilotkit/react-core';
import { MASTRA_BASE_URL, SPEAKER_NAME, TOPIC_NAME, CHAT_SUGGESTIONS } from '@/constants';
import { useAuth } from '@/components/auth-context';
import { RatingCard, InteractiveRatingCard, StatsCard } from '@/components/rating';
import '@copilotkit/react-ui/styles.css';


const ChatBotCopilotKit = () => {
  return (
    <CopilotKit
      runtimeUrl={`${MASTRA_BASE_URL}/copilotkit`}
      agent="infoHubAgent"
    >
      <Chat />
    </CopilotKit>
  );
};

const Chat = () => {
  const { user } = useAuth();

  useCopilotAction({
    name: 'queryInfoDataTool',
    available: 'disabled',
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: false,
      },
    ],
    render: ({ args, result, status }) => {
      console.log({ args, result, status });

      if (status !== 'complete') {
        return <div>Retrieving information...</div>;
      }

      // TODO: Implement the UI to display the retrieved information
      return <></>;
    },
  });

  // Human-in-the-Loop: rateSpeakerTopicTool
  useCopilotAction({
    name: 'rateSpeakerTopicTool',
    available: 'disabled',
    parameters: [
      {
        name: 'target',
        type: 'string',
        required: true,
        description:
          'What the user is rating: "speaker" or "topic"',
      },
    ],
    renderAndWait: ({ args, status, respond, result }) => {
      const resolvedName =
        args.target === 'speaker'
          ? SPEAKER_NAME
          : TOPIC_NAME;

      const reviewerDisplayName =
        user?.displayName || 'Anonymous';
      const reviewerUserId = user?.uid || 'anonymous';

      // After submission, show the completed rating card
      if (status === 'complete') {
        let completedRating = 0;
        let wasCancelled = false;
        try {
          const parsed = typeof result === 'string' ? JSON.parse(result) : result;
          if (parsed?.cancelled) {
            wasCancelled = true;
          } else {
            completedRating = parsed?.rating || 0;
          }
        } catch {
          // fallback
        }

        if (wasCancelled) {
          return (
            <div
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                borderRadius: '16px',
                padding: '20px 24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: '420px',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🚫</span>
              <span>Rating cancelled — no worries!</span>
            </div>
          );
        }

        return (
          <RatingCard
            target={args.target || 'speaker'}
            name={resolvedName}
            rating={completedRating}
            reviewerName={reviewerDisplayName}
            status={status}
          />
        );
      }

      // During 'inProgress', args are still streaming
      if (!respond) {
        return (
          <RatingCard
            target={args.target || 'speaker'}
            name={resolvedName}
            rating={0}
            reviewerName={reviewerDisplayName}
            status="inProgress"
          />
        );
      }

      // During 'executing', show the interactive rating card
      return (
        <InteractiveRatingCard
          target={args.target || 'speaker'}
          name={resolvedName}
          reviewerName={reviewerDisplayName}
          userId={reviewerUserId}
          email={user?.email || ''}
          onSubmit={(result) => respond(result)}
          onCancel={(result) => respond(result)}
        />
      );
    },
  });

  useCopilotAction({
    name: 'getRatingStatsTool',
    available: 'disabled',
    parameters: [
      {
        name: 'target',
        type: 'string',
        required: false,
        description:
          'Which ratings to retrieve: "speaker", "topic", or "all"',
      },
    ],
    render: ({ result, status }) => {
      return <StatsCard status={status} result={result} />;
    },
  });

  return (
    <CopilotChat
      labels={{
        title: 'DevDay Assistant',
        initial:
          'Hi! 👋 Ask me anything about DevDay, rate the speaker & topic, or check rating stats! ⭐',
      }}
      suggestions={CHAT_SUGGESTIONS}
      className="h-full w-full mx-auto flex px-6 py-4"
    />
  );
};

export default ChatBotCopilotKit;
