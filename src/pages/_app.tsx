import { useState } from 'react';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { TANSTCK_CLIENT_OPTIONS } from '@/shared/lib/config';
import '@/shared/styles/index.scss';

export default function App({ Component, pageProps }: AppProps) {
  const [client] = useState(() => new QueryClient(TANSTCK_CLIENT_OPTIONS));

  return (
    <QueryClientProvider client={client}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
