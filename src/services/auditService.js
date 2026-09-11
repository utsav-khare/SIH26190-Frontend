import { MOCK_RECENT_ACTIVITY } from '../utils/constants';
import { api } from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Audit service — tamper-evident ledger of vault activity.
 *
 * When VITE_USE_MOCK=true (default), reads are served from mock activity
 * records with simulated network latency.
 *
 * When VITE_USE_MOCK=false, reads are sent to the backend via the
 * centralized api client. Endpoints marked PENDING are not yet available
 * from the backend team.
 */
export const auditService = {
  /**
   * Fetch the full audit ledger (Audit Log page).
   * Mock: returns mock activity records.
   * Real:  GET /api/audit-logs  [PENDING — backend endpoint not yet available]
   */
  async getAuditLog() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...MOCK_RECENT_ACTIVITY];
    }
    return api.get('/audit-logs');
  },

  /**
   * Fetch recent vault activity (Dashboard timeline).
   * Mock: returns mock activity records.
   * Real:  GET /api/activity/recent  [PENDING — backend endpoint not yet available]
   */
  async getRecentActivity() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [...MOCK_RECENT_ACTIVITY];
    }
    return api.get('/activity/recent');
  }
};
