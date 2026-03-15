import { MastraReactProvider } from '@mastra/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';

import { MASTRA_BASE_URL } from '@/constants';
import { Layout, ThemeProvider } from '@/components';
import { Chat } from '@/pages';

export default function Page() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <MastraReactProvider baseUrl={MASTRA_BASE_URL}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" index element={<Chat />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </QueryClientProvider>
      </MastraReactProvider>
    </ThemeProvider>
  );
}
