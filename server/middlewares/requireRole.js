export default function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    try {
      const userRole = ((req.user && req.user.role) || '').toUpperCase();
      const ok = userRole && roles.some((r) => String(r).toUpperCase() === userRole);
      if (!ok) {
        return res.status(403).json({ message: 'Insufficient role for this action' });
      }
      return next();
    } catch (err) {
      console.error('requireRole error:', err);
      return res.status(500).json({ message: 'Authorization check failed' });
    }
  };
}