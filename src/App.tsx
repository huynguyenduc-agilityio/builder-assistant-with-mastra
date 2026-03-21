import { MastraReactProvider } from '@mastra/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';

import { MASTRA_BASE_URL } from '@/constants';
import { Layout, ThemeProvider, AuthProvider, ProtectedRoute } from '@/components';
import { Chat, Login } from '@/pages';

export default function Page() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <AuthProvider>
        <MastraReactProvider baseUrl={MASTRA_BASE_URL}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Chat />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </MastraReactProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

