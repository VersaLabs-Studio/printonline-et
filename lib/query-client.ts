// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Increase stale time to reduce refetches
        staleTime: 5 * 60 * 1000, // 5 minutes (was 1 minute)
        // Reduce unnecessary refetches
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        // Cache data longer
        gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
        // Reduce retry attempts to fail faster
        retry: 1,
        retryDelay: 1000,
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}