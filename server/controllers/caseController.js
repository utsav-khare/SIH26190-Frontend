import { cases, createCaseInput, assignOfficerToCase as assignOfficer, getOfficerById } from '../stores/caseStore.js';
import { validateCreateCase } from '../validators/caseValidator.js';

function enrichCase(c) {
  return {
    ...c,
    assignedOfficers: (c.assignedOfficerIds || [])
      .map((oid) => getOfficerById(oid))
      .filter(Boolean)
  };
}

export function getCases(req, res) {
  try {
    return res.json({ data: cases.map(enrichCase) });
  } catch (err) {
    console.error('caseController.getCases error:', err);
    return res.status(500).json({ message: 'Failed to load cases' });
  }
}

export function getCaseById(req, res) {
  try {
    // req.case is set by requireCaseJurisdiction middleware
    if (!req.case) {
      return res.status(404).json({ message: 'Case not found' });
    }
    return res.json({ data: enrichCase(req.case) });
  } catch (err) {
    console.error('caseController.getCaseById error:', err);
    return res.status(500).json({ message: 'Failed to load case' });
  }
}

export function createCase(req, res) {
  try {
    const payload = req.body || {};
    const validation = validateCreateCase(payload);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.errors.join('; ') });
    }
    const created = createCaseInput({
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      assignedOfficerIds: payload.assignedOfficerIds || [],
      createdBy: req.user?.id || 'unknown',
      notes: payload.notes || []
    });
    return res.status(201).json({ data: enrichCase(created) });
  } catch (err) {
    console.error('caseController.createCase error:', err);
    return res.status(500).json({ message: 'Failed to create case' });
  }
}

export function assignOfficerToCase(req, res) {
  try {
    const { officerId } = req.params;
    const officer = getOfficerById(officerId);
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    if (!req.case) {
      return res.status(404).json({ message: 'Case not found' });
    }
    const result = assignOfficer(req.case.id, officerId, req.body || {});
    if (!result) {
      return res.status(404).json({ message: 'Case not found' });
    }
    return res.json({ data: { officer, ...result } });
  } catch (err) {
    console.error('caseController.assignOfficerToCase error:', err);
    return res.status(500).json({ message: 'Failed to assign officer' });
  }
}