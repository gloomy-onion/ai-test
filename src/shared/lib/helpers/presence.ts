import { useEffect, useState } from 'react';
import { connectSupabasePresence } from './presence-supabase';
import { connectWsPresence } from './presence-ws';

export type PresenceSource = 'ws' | 'supabase';

export const DEFAULT_PRESENCE_SOURCE: PresenceSource =
  process.env.NEXT_PUBLIC_PRESENCE_SOURCE === 'ws' ? 'ws' : 'supabase';

const CONNECTORS = {
  ws: connectWsPresence,
  supabase: connectSupabasePresence,
} as const;

export const usePresence = (source: PresenceSource, userId: string): string[] => {
  const [online, setOnline] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    return CONNECTORS[source](userId, setOnline);
  }, [source, userId]);

  return online;
};
