import bcrypt from 'bcryptjs';

let nextId = 1000;
const users = [];

function seed() {
  const seedAccounts = [
    { email: 'admin@firm.com', role: 'ADMIN', department: 'CYBER_CELL', name: 'Admin User' },
    { email: 'officer@firm.com', role: 'OFFICER', department: 'CYBER_CELL', name: 'Riya Nair' },
    { email: 'attorney@firm.com', role: 'INVESTIGATOR', department: 'CYBER_CELL', name: 'Tanya Verma' },
    { email: 'advocate@firm.com', role: 'ADVOCATE', department: 'GENERAL', name: 'Advocate User' },
    { email: 'investigator@firm.com', role: 'INVESTIGATOR', department: 'CYBER_CELL', name: 'Varun Menon' }
  ];
  seedAccounts.forEach((account) => {
    const id = 'usr-' + String(nextId++);
    users.push({
      id,
      email: account.email,
      passwordHash: bcrypt.hashSync('vault2026', 10),
      role: account.role,
      department: account.department,
      name: account.name,
      metadata: {},
      forcedPasswordChange: false,
      createdAt: new Date().toISOString()
    });
  });
}

seed();

export function addUser(data) {
  const id = 'usr-' + String(nextId++);
  const user = {
    id,
    email: data.email.toLowerCase().trim(),
    passwordHash: bcrypt.hashSync(data.password, 10),
    role: (data.role || 'OFFICER').toUpperCase(),
    department: (data.department || 'GENERAL').toUpperCase(),
    name: data.name || data.email.split('@')[0],
    metadata: data.metadata || {},
    forcedPasswordChange: false,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  return safeUser(user);
}

export function findUserByEmail(email) {
  return users.find((u) => u.email === (email || '').toLowerCase().trim()) || null;
}

export function findUserById(id) {
  return users.find((u) => u.id === id) || null;
}

export function updateUser(id, patch) {
  const target = findUserById(id);
  if (!target) return null;
  if (patch.password) {
    target.passwordHash = bcrypt.hashSync(patch.password, 10);
  }
  if (patch.role !== undefined) target.role = patch.role.toUpperCase();
  if (patch.department !== undefined) target.department = patch.department.toUpperCase();
  if (patch.name !== undefined) target.name = patch.name;
  if (patch.forcedPasswordChange !== undefined) target.forcedPasswordChange = !!patch.forcedPasswordChange;
  return safeUser(target);
}

export function listUsers() {
  return users.map(safeUser);
}

function safeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    department: user.department,
    name: user.name,
    metadata: user.metadata,
    forcedPasswordChange: user.forcedPasswordChange || false,
    createdAt: user.createdAt
  };
}