import { CopilotChat } from '@copilotkit/react-ui';
import { CopilotKit, useCopilotAction } from '@copilotkit/react-core';
import { MASTRA_BASE_URL } from '@/constants';
import '@copilotkit/react-ui/styles.css';

// TODO: Need update
const suggestions: { title: string; message: string }[] = [];

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

  return (
    <CopilotChat
      labels={{
        title: 'DevDay Assistant',
        initial:
          'Hi! 👋 Ask me anything about DevDay—speakers, sessions, or topics.',
      }}
      suggestions={suggestions}
      className="h-full w-full mx-auto flex px-6 py-4"
    />
  );
};

export default ChatBotCopilotKit;
