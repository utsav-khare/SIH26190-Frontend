import jwt from 'jsonwebtoken';

export default function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers?.authorization || '';
    const parts = authHeader.split(/\s+/);
    if (parts[0]?.toLowerCase() !== 'bearer' || !parts[1]) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const token = parts[1];
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'dev-access-secret');
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      department: payload.department
    };
    return next();
  } catch (err) {
    console.error('requireAuth error:', err);
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }
    return res.status(500).json({ message: 'Authentication error' });
  }
}