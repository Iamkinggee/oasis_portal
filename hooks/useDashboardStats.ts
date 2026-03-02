// hooks/useDashboardStats.ts
// Fetches the personalised dashboard KPIs for the logged-in user.
// Uses the dashboard_stats view created in the SQL migration.

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DashboardStats } from '@/lib/supabase/types';

interface UseDashboardStatsResult {
  stats:   DashboardStats | null;
  loading: boolean;
  error:   string | null;
  refetch: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsResult {
  const supabase = createClient();

  const [stats,   setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); setLoading(false); return; }

    const { data, error: fetchError } = await supabase
      .from('dashboard_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setStats(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}