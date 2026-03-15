import { CopilotChat } from '@copilotkit/react-ui';
import { CopilotKit } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';
import { MASTRA_BASE_URL } from '@/constants';

// TODO: Need update
const suggestions: { title: string; message: string }[] = [];

const CopilotKitDemo = () => {
  return (
    <CopilotKit
      runtimeUrl={`${MASTRA_BASE_URL}/copilotkit`}
      agent="ghibliAgent"
      enableInspector={false}
    >
      <CopilotChat
        labels={{
          title: 'DevDay Assistant',
          initial:
            'Hi! 👋 Ask me anything about DevDay—speakers, sessions, or topics.',
        }}
        suggestions={suggestions}
        className="h-full w-full mx-auto flex px-6 py-4"
      />
    </CopilotKit>
  );
};

export default CopilotKitDemo;
