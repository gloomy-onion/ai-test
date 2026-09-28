import { createBrowserSupabase } from '@/shared/lib/supabase';

const CHANNEL_TOPIC = 'community';

type PresencePayload = { userId: string };

export const connectSupabasePresence = (
  userId: string,
  onOnline: (userIds: string[]) => void,
): (() => void) => {
  const supabase = createBrowserSupabase();
  const channel = supabase.channel(CHANNEL_TOPIC);

  const sync = () => {
    const state = channel.presenceState<PresencePayload>();
    const userIds = new Set<string>();

    Object.values(state).forEach((entries) => {
      entries.forEach((entry) => {
        userIds.add(entry.userId);
      });
    });

    onOnline([...userIds]);
  };

  channel
    .on('presence', { event: 'sync' }, sync)
    .on('presence', { event: 'join' }, sync)
    .on('presence', { event: 'leave' }, sync)
    .subscribe(async (status, err) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error('[presence:supabase]', status, err, err?.cause);

        return;
      }

      if (status === 'SUBSCRIBED') {
        await channel.track({ userId });
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
};
