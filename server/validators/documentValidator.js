export function validateAddDocument(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return { ok: false, errors: ['Request body is required'] };
  }
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    errors.push('name is required');
  }
  if (payload.size !== undefined && (typeof payload.size !== 'number' || payload.size < 0 || !isFinite(payload.size))) {
    errors.push('size must be a non-negative number');
  }
  if (payload.type !== undefined && typeof payload.type !== 'string') {
    errors.push('type must be a string');
  }
  if (payload.caseId !== undefined && typeof payload.caseId !== 'string') {
    errors.push('caseId must be a string');
  }
  if (payload.metadata !== undefined && typeof payload.metadata !== 'object') {
    errors.push('metadata must be an object');
  }
  return { ok: errors.length === 0, errors };
}