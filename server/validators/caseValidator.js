export function validateCreateCase(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return { ok: false, errors: ['Request body is required'] };
  }
  if (!payload.title || typeof payload.title !== 'string' || payload.title.trim().length === 0) {
    errors.push('title is required');
  }
  if (payload.description !== undefined && typeof payload.description !== 'string') {
    errors.push('description must be a string');
  }
  if (payload.status !== undefined && !['open','pending','closed','archived'].includes(payload.status)) {
    errors.push('status must be one of: open, pending, closed, archived');
  }
  if (payload.priority !== undefined && !['low','medium','high','critical'].includes(payload.priority)) {
    errors.push('priority must be one of: low, medium, high, critical');
  }
  if (payload.assignedOfficerIds !== undefined) {
    if (!Array.isArray(payload.assignedOfficerIds)) {
      errors.push('assignedOfficerIds must be an array');
    } else if (payload.assignedOfficerIds.some((id) => typeof id !== 'string' || id.trim().length === 0)) {
      errors.push('assignedOfficerIds must contain non-empty string ids');
    }
  }
  if (payload.notes !== undefined && !Array.isArray(payload.notes)) {
    errors.push('notes must be an array');
  }
  return { ok: errors.length === 0, errors };
}
