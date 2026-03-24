import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRespondError?: () => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundaryChatBot extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(_error: Error, _: React.ErrorInfo) {
    const { onRespondError } = this.props;
    /**
     * Respond with error and complete inProgress message
     */
    if (onRespondError) {
      onRespondError();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
