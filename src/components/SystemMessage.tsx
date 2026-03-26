import React, { useRef, useEffect, useState } from 'react';
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
import { ProcessingIndicator } from './ProcessingIndicator';
import { InterruptedMessage } from './InterruptedMessage';

// Utils
import { combineClasses } from '@/utils';

// Constants
import { CHATBOT_MESSAGES, LONG_RESPONSE_TIME } from '@/constants';

interface BridgeProps {
  RenderComponent?: (args: unknown) => React.ReactNode;
  isExecuting?: boolean;
  toolCall?: unknown;
  toolMessage?: unknown;
}

const getComponentName = (node: React.ReactNode): string => {
  if (!React.isValidElement(node)) return '';
  const type = node.type as { displayName?: string; name?: string };
  return type?.displayName ?? type?.name ?? '';
};

// Returns true when subComponent will render a real custom card.
// CoAgentStateRenderBridge wraps all useCopilotAction render() outputs —
// we call RenderComponent() to check if it produces actual content.
const hasRealCard = (subComponent: React.ReactNode): boolean => {
  if (!subComponent) return false;
  if (!React.isValidElement(subComponent)) return false;

  const name = getComponentName(subComponent);
  const props = (subComponent as React.ReactElement).props as BridgeProps;

  // CoAgentStateRenderBridge — check if RenderComponent produces real content
  if (name === 'CoAgentStateRenderBridge') {
    if (!props.RenderComponent) return false;

    // Call the render function to see what it produces
    try {
      const rendered = props.RenderComponent({});
      if (!rendered) return false;
      if (!React.isValidElement(rendered)) return false;

      // Empty fragment so no card
      if ((rendered as React.ReactElement).type === React.Fragment) {
        const children = (
          (rendered as React.ReactElement).props as { children?: unknown }
        ).children;
        return Boolean(children);
      }

      // ProcessingIndicator → still loading, not a card
      const renderedName = getComponentName(rendered);
      if (renderedName === 'ProcessingIndicator') return false;

      return true;
    } catch {
      return false;
    }
  }

  // Direct component (not wrapped) — treat as real card
  return true;
};

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

  const showCard = hasRealCard(subComponent);

  // Auto-stop if agent takes too long
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
        <div className="w-[30px] h-[30px] rounded-2xl flex items-center justify-center shrink-0">
          <img
            src="https://static.wixstatic.com/media/484b05_17aeb9761fe84d89bffaec05d4ca3160%7Emv2.png/v1/fill/w_32%2Ch_32%2Clg_1%2Cusm_0.66_1.00_0.01/484b05_17aeb9761fe84d89bffaec05d4ca3160%7Emv2.png"
            alt="DevDay Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {isProcessing && !content && !showCard ? (
          // Waiting for first token — show spinner
          <ProcessingIndicator />
        ) : showCard ? (
          subComponent
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
            </div>
          )
        )}
      </div>
    </ErrorBoundaryChatBot>
  );
};

export { AssistantMessage as SystemMessage };
