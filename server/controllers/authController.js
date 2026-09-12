import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { addUser, findUserByEmail, findUserById, updateUser } from '../stores/authStore.js';

const ACCESS_SECRET = () => process.env.ACCESS_TOKEN_SECRET || 'dev-access-secret';
const REFRESH_SECRET = () => process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret';

function signTokens(user) {
  const base = { sub: user.id, email: user.email, role: user.role, department: user.department };
  return {
    accessToken: jwt.sign(base, ACCESS_SECRET(), { expiresIn: '15m' }),
    refreshToken: jwt.sign(base, REFRESH_SECRET(), { expiresIn: '7d' }),
    user: { id: user.id, email: user.email, role: user.role, department: user.department },
    expiresIn: 15 * 60
  };
}

export function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = findUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const result = signTokens(user);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth'
    });
    return res.json({
      user: result.user,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn
    });
  } catch (err) {
    console.error('auth.login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET());
}

export function refreshSession(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    const payload = verifyRefresh(token);
    const user = findUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Session invalid' });
    }
    const result = signTokens(user);
    return res.json({ accessToken: result.accessToken, expiresIn: result.expiresIn });
  } catch (err) {
    console.error('auth.refreshSession error:', err);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}

export function refreshToken(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    const payload = verifyRefresh(token);
    const user = findUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Session invalid' });
    }
    const result = signTokens(user);
    return res.json({ accessToken: result.accessToken, expiresIn: result.expiresIn });
  } catch (err) {
    console.error('auth.refreshToken error:', err);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}

export function logout(req, res) {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth'
    });
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('auth.logout error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export function registerStaff(req, res) {
  try {
    const payload = req.body || {};
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ message: 'Request body is required' });
    }
    if (!payload.email || typeof payload.email !== 'string' || !payload.email.includes('@')) {
      return res.status(400).json({ message: 'email is required and must be valid' });
    }
    if (!payload.password || typeof payload.password !== 'string' || payload.password.length < 8) {
      return res.status(400).json({ message: 'password must be at least 8 characters' });
    }
    if (!payload.role || typeof payload.role !== 'string') {
      return res.status(400).json({ message: 'role is required' });
    }
    if (!payload.department || typeof payload.department !== 'string') {
      return res.status(400).json({ message: 'department is required' });
    }
    if (findUserByEmail(payload.email)) {
      return res.status(409).json({ message: 'A staff account with this email already exists' });
    }
    const created = addUser({
      email: payload.email,
      password: payload.password,
      role: payload.role.toUpperCase(),
      department: payload.department.toUpperCase(),
      name: payload.name || payload.email.split('@')[0],
      metadata: payload.metadata || {}
    });
    return res.status(201).json({ data: created });
  } catch (err) {
    console.error('auth.registerStaff error:', err);
    return res.status(500).json({ message: 'Failed to register staff' });
  }
}

export function resetPassword(req, res) {
  try {
    const { targetUserId } = req.params;
    const target = findUserById(targetUserId);
    if (!target) {
      return res.status(404).json({ message: 'Target user not found' });
    }
    const payload = req.body || {};
    if (!payload.newPassword || typeof payload.newPassword !== 'string' || payload.newPassword.trim().length === 0) {
      return res.status(400).json({ message: 'newPassword is required' });
    }
    const updated = updateUser(targetUserId, {
      password: payload.newPassword,
      forcedPasswordChange: payload.forcedPasswordChange !== false
    });
    return res.json({ data: updated });
  } catch (err) {
    console.error('auth.resetPassword error:', err);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
}