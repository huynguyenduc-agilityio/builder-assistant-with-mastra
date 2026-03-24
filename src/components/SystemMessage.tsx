import { useRef, useEffect, useState } from 'react';
import { Markdown, type AssistantMessageProps } from '@copilotkit/react-ui';
import { useCopilotChat } from '@copilotkit/react-core';
import {
  Role,
  TextMessage,
  type Message,
} from '@copilotkit/runtime-client-gql';

// Hooks
import { useScrollToBottom } from '@/hooks';

// Components
import { ErrorBoundaryChatBot } from './ErrorBoundaryChatBot';
import { BotAvatar } from './BotAvatar';
import { ProcessingIndicator } from './ProcessingIndicator';
import { InterruptedMessage } from './InterruptedMessage';

// Utils
import { combineClasses } from '@/utils';

// Constants
import { CHATBOT_MESSAGES, LONG_RESPONSE_TIME } from '@/constants';

const handleUnResponsiveMessage = (
  appendMessage: (message: Message) => void,
  stopGeneration: () => void,
  content: string = CHATBOT_MESSAGES.HANG_ON,
  messages: Message[],
) => {
  const lastMessage = messages.at(-1);
  if (
    lastMessage?.type === 'TextMessage' &&
    (lastMessage as TextMessage)?.content?.trim() !==
      CHATBOT_MESSAGES.HANG_ON &&
    (lastMessage as TextMessage)?.content?.trim() !==
      CHATBOT_MESSAGES.INTERRUPTED
  ) {
    appendMessage(
      new TextMessage({
        content,
        role: Role.Assistant,
        createdAt: lastMessage.createdAt,
      }),
    );
  }
  stopGeneration();
};

export const AssistantMessage = ({
  message: originalMessage,
  subComponent,
  isLoading,
  isGenerating,
}: AssistantMessageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSlowResponse, setIsSlowResponse] = useState(false);

  const { stopGeneration, appendMessage, visibleMessages } = useCopilotChat();

  // Normalize message
  const message =
    typeof originalMessage === 'string'
      ? (originalMessage as string).trim()
      : (
          ((originalMessage as unknown as { content?: string })?.content ??
            '') as string
        ).trim();

  const cleanedMessage = message?.replace(/\{[^}]*\}/g, '').trim();

  // Processing state
  const welcomeActive = document.body.classList.contains('welcome-active');
  const isProcessing = (isGenerating || isLoading) && !welcomeActive;

  const unresponsiveSystem =
    message === CHATBOT_MESSAGES.HANG_ON ||
    message === CHATBOT_MESSAGES.INTERRUPTED ||
    isSlowResponse;

  const content = unresponsiveSystem
    ? cleanedMessage || CHATBOT_MESSAGES.HANG_ON
    : cleanedMessage;

  // Slow response timeout
  useEffect(() => {
    if (!isLoading) return;

    timeoutRef.current = setTimeout(() => {
      setIsSlowResponse(true);
      stopGeneration();
    }, LONG_RESPONSE_TIME);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsSlowResponse(false);
    };
  }, [isLoading]);

  // Scroll
  useScrollToBottom(ref);

  useEffect(() => {
    if (!isProcessing || !cleanedMessage) return;
    const container = document.querySelector<HTMLElement>(
      '.copilotKitScrollContainer',
    );
    container?.scrollTo({ top: container.scrollHeight, behavior: 'instant' });
  }, [cleanedMessage, isProcessing]);

  // TODO: Check behavior pending later
  // if (!content && !isProcessing) return null;

  return (
    <ErrorBoundaryChatBot
      onRespondError={() =>
        handleUnResponsiveMessage(
          appendMessage,
          stopGeneration,
          CHATBOT_MESSAGES.ERROR,
          visibleMessages,
        )
      }
      fallback={
        <InterruptedMessage message={CHATBOT_MESSAGES.ERROR_FALLBACK} />
      }
    >
      <div ref={ref} className="flex items-start gap-2.5 py-1">
        <BotAvatar />
        {isProcessing && !content ? (
          <ProcessingIndicator />
        ) : (
          content && (
            <div
              className={combineClasses(
                'px-4 py-2.5 text-sm leading-relaxed max-w-[72%] backdrop-blur-md',
                'rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl',
                'bg-white/80 dark:bg-white/[.08]',
                'text-[#1e1040] dark:text-white/[.87]',
                'border border-[rgba(100,80,200,0.22)] dark:border-white/10',
                'shadow-[0_2px_14px_rgba(100,80,200,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]',
              )}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:font-semibold">
                <Markdown content={content} />
              </div>
              {subComponent}
            </div>
          )
        )}
      </div>
    </ErrorBoundaryChatBot>
  );
};

export { AssistantMessage as SystemMessage };
