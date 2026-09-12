export default function requireDepartment(allowedDepartment) {
  return (req, res, next) => {
    try {
      const userDept = ((req.user && req.user.department) || '').toUpperCase();
      const required = (allowedDepartment || '').toUpperCase();
      if (!userDept || userDept !== required) {
        return res.status(403).json({ message: 'Access denied for this department' });
      }
      return next();
    } catch (err) {
      console.error('requireDepartment error:', err);
      return res.status(500).json({ message: 'Authorization check failed' });
    }
  };
}
