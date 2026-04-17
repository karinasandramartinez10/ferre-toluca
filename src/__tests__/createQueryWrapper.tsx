import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PricingProvider } from "../context/pricing/PricingProvider";

export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <PricingProvider>{children}</PricingProvider>
    </QueryClientProvider>
  );

  return { wrapper: Wrapper, queryClient };
}
