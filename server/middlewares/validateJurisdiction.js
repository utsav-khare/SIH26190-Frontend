export default function validateJurisdiction(req, res, next) {
  try {
    const payload = req.body || {};
    const jurisdiction = (payload.jurisdiction || '').trim().toUpperCase();
    const allowed = ['CITY_A','CITY_B','REGION_1','NATIONWIDE','CYBER_CELL'];
    if (!jurisdiction) {
      return res.status(400).json({ message: 'jurisdiction is required' });
    }
    if (!allowed.includes(jurisdiction)) {
      return res.status(400).json({ message: 'Invalid jurisdiction' });
    }
    req.jurisdiction = jurisdiction;
    return next();
  } catch (err) {
    console.error('validateJurisdiction error:', err);
    return res.status(500).json({ message: 'Validation failed' });
  }
}
