import { CopilotChat, Markdown } from '@copilotkit/react-ui';
import { CopilotKit, useCopilotAction } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';
import { useAuth } from '@/components/auth-context';
import {
  RatingCard,
  InteractiveRatingCard,
  StatsCard,
} from '@/components/rating';

// Types
import type { SpeakerInfo } from '@/types';
import { ACTION_HANDLER_STATUS, InfoHubResponseType } from '@/types';
import { parseResult } from '@/utils';

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
import { SpeakerResultRenderer } from '@/components/SpeakerResultRenderer';
import { VenueResultCard } from '@/components/VenueCard';
import { ContactResultCard } from '@/components/ContactCard';
import { AgendaResultCard } from '@/components/AgendaCard';
import { PartnerResultCard } from '@/components/PartnerCard';

// Constants
import { COPILOT_LABEL, MASTRA_BASE_URL } from '@/constants';

const RESULT_CARD_MAP: Record<
  InfoHubResponseType,
  (result: unknown) => React.ReactNode
> = {
  speaker: (result) => <SpeakerResultRenderer result={result} />,
  venue: (result) => <VenueResultCard result={result} />,
  contact_us: (result) => <ContactResultCard result={result} />,
  agenda: (result) => <AgendaResultCard result={result} />,
  partner: (result) => <PartnerResultCard result={result} />,
};

const Chat = () => {
  const { user } = useAuth();

  useCopilotAction({
    name: 'queryInfoDataTool',
    available: 'disabled',
    followUp: false,
    render: ({ args, status, result }) => {
      console.log('{ args, status, result }: ', { args, status, result });
      if (status !== ACTION_HANDLER_STATUS.COMPLETE)
        return <ProcessingIndicator />;

      const parsed = parseResult<{ type: InfoHubResponseType }>(result);

      const renderCard = parsed?.type
        ? RESULT_CARD_MAP[parsed.type as InfoHubResponseType]
        : null;

      if (renderCard) return renderCard(result) as React.ReactElement;

      const text = typeof result === 'string' ? result : JSON.stringify(result);
      return (
        <div className="px-4 py-2.5 text-sm leading-relaxed max-w-[72%] backdrop-blur-md rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-white/80 dark:bg-white/[.08] text-[#1e1040] dark:text-white/[.87] border border-[rgba(100,80,200,0.22)] dark:border-white/10 shadow-[0_2px_14px_rgba(100,80,200,0.1)]">
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:font-semibold">
            <Markdown content={text} />
          </div>
        </div>
      );
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
        description:
          'The name of the speaker or topic that the user wants to rate',
      },
      {
        name: 'speakerRole',
        type: 'string',
        required: false,
        description:
          'The role/title of the speaker (from queryInfoDataTool result)',
      },
      {
        name: 'speakerCompany',
        type: 'string',
        required: false,
        description:
          'The company of the speaker (from queryInfoDataTool result)',
      },
      {
        name: 'speakerAvatar',
        type: 'string',
        required: false,
        description:
          'The avatar URL of the speaker (from queryInfoDataTool result)',
      },
    ],
    renderAndWait: ({ args, status, respond, result }) => {
      const resolvedTarget = args.target || 'speaker';
      const resolvedName =
        args.name ||
        (resolvedTarget === InfoHubResponseType.SPEAKER ? 'Speaker' : 'Topic');

      const reviewerDisplayName = user?.displayName || 'Anonymous';
      const reviewerUserId = user?.uid || 'anonymous';

      // Build speakerInfo from args (passed by the agent from queryInfoDataTool result)
      const speakerInfo: SpeakerInfo | undefined =
        args.speakerRole || args.speakerCompany || args.speakerAvatar
          ? {
              role: args.speakerRole || undefined,
              company: args.speakerCompany || undefined,
              avatar: args.speakerAvatar || undefined,
            }
          : undefined;

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
            speakerInfo={speakerInfo}
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
            speakerInfo={speakerInfo}
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
          speakerInfo={speakerInfo}
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
      {
        name: 'speakerRole',
        type: 'string',
        required: false,
        description:
          'The role/title of the speaker (from queryInfoDataTool result)',
      },
      {
        name: 'speakerCompany',
        type: 'string',
        required: false,
        description:
          'The company of the speaker (from queryInfoDataTool result)',
      },
      {
        name: 'speakerAvatar',
        type: 'string',
        required: false,
        description:
          'The avatar URL of the speaker (from queryInfoDataTool result)',
      },
    ],
    render: ({ args, result, status }) => {
      // Build speakerInfo from args (only for speaker stats, not topic)
      const statsSpeakerInfo: SpeakerInfo | undefined =
        args.speakerRole || args.speakerCompany || args.speakerAvatar
          ? {
              role: args.speakerRole || undefined,
              company: args.speakerCompany || undefined,
              avatar: args.speakerAvatar || undefined,
            }
          : undefined;

      return (
        <StatsCard
          status={status}
          result={result}
          speakerInfo={statsSpeakerInfo}
        />
      );
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
        <CopilotKit
          runtimeUrl={`${MASTRA_BASE_URL}/copilotkit`}
          agent="infoHubAgent"
        >
          <Header />
          <div className="flex-1 overflow-hidden">
            <Chat />
          </div>
        </CopilotKit>
      </div>
    </>
  );
};

export default ChatBotCopilotKit;
