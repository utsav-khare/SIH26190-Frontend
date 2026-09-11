import { MOCK_APPROVALS } from '../utils/constants';
import { api } from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// In-memory mock store — used only when VITE_USE_MOCK=true
let localApprovals = [...MOCK_APPROVALS];

/**
 * Approval service — clearance & document release authorization requests.
 *
 * When VITE_USE_MOCK=true (default), all operations run against an
 * in-memory array with simulated network latency.
 *
 * When VITE_USE_MOCK=false, operations are sent to the backend via the
 * centralized api client. Endpoints marked PENDING are not yet available
 * from the backend team.
 */
export const approvalService = {
  /**
   * Fetch all approval requests.
   * Mock: returns in-memory array.
   * Real:  GET /api/approvals  [PENDING — backend endpoint not yet available]
   */
  async getApprovals() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return [...localApprovals];
    }
    return api.get('/approvals');
  },

  /**
   * Record an authorization decision ('Approved' | 'Denied') for a request.
   * Mock: updates the in-memory record.
   * Real:  POST /api/approvals/:id/decision  -> updated approval
   *        [PENDING — backend endpoint not yet available]
   */
  async decideApproval(id, action) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      localApprovals = localApprovals.map((a) => (a.id === id ? { ...a, status: action } : a));
      return localApprovals.find((a) => a.id === id) || null;
    }
    return api.post(`/approvals/${id}/decision`, { action });
  }
};
