import { CopilotChat } from '@copilotkit/react-ui';
import { CopilotKit, useCopilotAction } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';
import { useAuth } from '@/components/auth-context';
import {
  RatingCard,
  InteractiveRatingCard,
  StatsCard,
} from '@/components/rating';

// Components
import { ProcessingIndicator, resolveIsDark, useTheme } from '@/components';
import {
  UserMessage,
  AssistantMessage,
  CustomInput,
  WelcomeScreen,
  Header,
  Blobs,
} from '@/components';

// Constants
import {
  COPILOT_LABEL,
  MASTRA_BASE_URL,
  SPEAKER_NAME,
  TOPIC_NAME,
} from '@/constants';

// Types
import { ACTION_HANDLER_STATUS } from '@/types';

const Chat = () => {
  const { user } = useAuth();

  useCopilotAction({
    name: 'queryInfoDataTool',
    available: 'disabled',
    parameters: [{ name: 'query', type: 'string', required: false }],
    render: ({ status }) => {
      if (status !== ACTION_HANDLER_STATUS.COMPLETE) {
        return <ProcessingIndicator />;
      }

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
        description: 'What the user is rating: "speaker" or "topic"',
      },
    ],
    renderAndWait: ({ args, status, respond, result }) => {
      const resolvedName =
        args.target === 'speaker' ? SPEAKER_NAME : TOPIC_NAME;

      const reviewerDisplayName = user?.displayName || 'Anonymous';
      const reviewerUserId = user?.uid || 'anonymous';

      // After submission, show the completed rating card
      if (status === 'complete') {
        let completedRating = 0;
        let wasCancelled = false;
        try {
          const parsed =
            typeof result === 'string' ? JSON.parse(result) : result;
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
                background:
                  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
        description: 'Which ratings to retrieve: "speaker", "topic", or "all"',
      },
    ],
    render: ({ result, status }) => {
      return <StatsCard status={status} result={result} />;
    },
  });

  return (
    <div className="relative h-full w-full">
      <WelcomeScreen />
      <CopilotChat
        labels={{ title: COPILOT_LABEL.TITLE }}
        UserMessage={UserMessage}
        AssistantMessage={AssistantMessage}
        Input={CustomInput}
        className="h-full w-full flex flex-col overflow-hidden bg-transparent [&_.copilotKitHeader]:hidden [&_.copilotKitBranding]:hidden"
      />
    </div>
  );
};

const ChatBotCopilotKit = () => {
  const { theme } = useTheme();
  const isDark = resolveIsDark(theme);

  return (
    <>
      <div className="fixed inset-0 z-0 transition-all duration-500 bg-[linear-gradient(135deg,#e8e4ff_0%,#f0eeff_35%,#e4f4ff_70%,#eafaf5_100%)] dark:bg-[linear-gradient(135deg,#0f0c29_0%,#1a1035_40%,#0d1b2a_100%)]" />
      <Blobs opacity={isDark ? 0.45 : 0.2} />
      <div className="noise-overlay fixed inset-0 pointer-events-none z-[1] opacity-[0.06] dark:opacity-[0.16]" />

      <div className="relative z-[2] w-full h-dvh flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-hidden">
          <CopilotKit
            runtimeUrl={`${MASTRA_BASE_URL}/copilotkit`}
            agent="infoHubAgent"
          >
            <Chat />
          </CopilotKit>
        </div>
      </div>
    </>
  );
};

export default ChatBotCopilotKit;
