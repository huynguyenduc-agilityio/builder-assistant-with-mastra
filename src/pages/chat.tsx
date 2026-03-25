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

  // Human-in-the-Loop: rateTool
  useCopilotAction({
    name: 'rateTool',
    available: 'disabled',
    parameters: [
      {
        name: 'target',
        type: 'string',
        required: true,
        description: 'What the user is rating: "speaker" or "topic"',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'The name of the speaker or topic that the user wants to rate',
      },
    ],
    renderAndWait: ({ args, status, respond, result }) => {
      const resolvedTarget = args.target || 'speaker';
      const resolvedName = args.name || (resolvedTarget === 'speaker' ? 'Speaker' : 'Topic');

      const reviewerDisplayName = user?.displayName || 'Anonymous';
      const reviewerUserId = user?.uid || 'anonymous';

      // After submission, show the completed rating card
      if (status === ACTION_HANDLER_STATUS.COMPLETE) {
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
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[rgba(100,80,200,0.22)] dark:border-white/10 bg-white/80 dark:bg-white/[.08] backdrop-blur-md shadow-[0_2px_10px_rgba(251,146,60,0.08)] max-w-fit">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-400/15 shrink-0">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="text-orange-400 dark:text-orange-300"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
              <span className="text-md whitespace-nowrap">
                Rating cancelled — no worries!
              </span>
            </div>
          );
        }

        return (
          <RatingCard
            target={resolvedTarget}
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
            target={resolvedTarget}
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
          target={resolvedTarget}
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
        description: 'What to retrieve stats for: "speaker" or "topic"',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'The speaker or topic name to retrieve rating stats for',
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
