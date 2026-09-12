export default function requireCaseJurisdiction(paramName = 'id') {
  return async function (req, res, next) {
    try {
      const { cases } = await import('../stores/caseStore.js');
      const targetId = req.params[paramName];
      if (!targetId) {
        return res.status(400).json({ message: 'Case identifier required' });
      }
      const target = cases.find((c) => c.id === targetId);
      if (!target) {
        return res.status(404).json({ message: 'Case not found' });
      }
      req.case = target;
      return next();
    } catch (err) {
      console.error('requireCaseJurisdiction error:', err);
      return res.status(500).json({ message: 'Authorization check failed' });
    }
  };
}
