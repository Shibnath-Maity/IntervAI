import { useEffect, useState } from "react";
import { getMockDashboardData } from "../data/mockDashboard";

/**
 * Single entry point for dashboard data.
 *
 * Currently resolves mock data after a short delay so loading states are real.
 * To connect a backend later, replace the setTimeout block with your own
 * request — keep returning { loading, error, data } and the components won't
 * need to change.
 */
export function useDashboardData() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (!cancelled) {
        setState({ loading: false, error: null, data: getMockDashboardData() });
      }
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return state;
}

export default useDashboardData;