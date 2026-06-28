import type { AppProps } from 'next/app';
import { useState } from 'react';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TANSTCK_CLIENT_OPTIONS } from '@/shared/lib/config';
import '@/shared/styles/_root.scss';
import '@/shared/styles/_colors.scss';
import '@/shared/styles/_globals.scss';
import '@/shared/styles/_keyframes.scss';

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
