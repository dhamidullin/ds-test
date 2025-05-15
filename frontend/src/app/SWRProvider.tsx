'use client'

// TODO: move this component to a separate directory as it's a HOC

import { type SWRConfiguration, SWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";

interface SWRProviderProps {
  children: React.ReactNode
}

const swrConfig: SWRConfiguration = {
  fetcher,
  // refreshInterval: 10 * 1000,
  // revalidateIfStale: false,
  // revalidateOnFocus: false,
  // revalidateOnReconnect: false,

  provider: (cache) => {
    // Skip localStorage on server side
    if (typeof window === 'undefined') {
      return cache;
    }

    const localStorageKey = 'swr-cache-6iOjpIV3A2';
    const map = new Map<string, any>(JSON.parse(localStorage.getItem(localStorageKey) || '[]'));

    // Save cache on page unload
    window.addEventListener('beforeunload', () => {
      const entries = Array.from(map.entries());
      localStorage.setItem(localStorageKey, JSON.stringify(entries));
    });

    return map;
  }
}

const SWRProvider: React.FC<SWRProviderProps> = ({ children }) => (
  <SWRConfig value={swrConfig}>
    {children}
  </SWRConfig>
)

export default SWRProvider;
