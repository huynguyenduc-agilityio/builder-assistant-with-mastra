import { MastraReactProvider } from '@mastra/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';

import { ThemeProvider } from './components';

export default function Page() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <MastraReactProvider baseUrl={''}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter></BrowserRouter>
        </QueryClientProvider>
      </MastraReactProvider>
    </ThemeProvider>
  );
}
