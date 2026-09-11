// Application constants and mock data matching mockup

export const APP_CONFIG = {
  appName: 'Digilegal Vault',
  tagline: 'SECURE. MANAGE. PROTECT.',
  version: '1.0.0',
  year: '2026',
  demoCredentials: {
    email: 'attorney@firm.com',
    password: 'vault2026'
  }
};

export const SUPPORTED_UPLOAD = {
  accept: '.pdf,.jpg,.jpeg,.png',
  label: 'PDF, JPG, JPEG, PNG',
  maxSizeMB: 50,
  // Detects vault category (PDF | IMG) from a file name; returns null if unsupported
  detectType: (fileName = '') => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return 'IMG';
    return null;
  }
};

export const MOCK_USER = {
  id: 'usr-9021',
  name: 'Officer',
  email: 'attorney@firm.com',
  department: 'Legal Department',
  role: 'Officer', // 'Admin' | 'Officer' | 'Attorney'
  clearanceLevel: 'Level 4 Top Secret',
  status: 'Active'
};

// Step 12 — [PENDING] GET /api/metrics. The dashboard derives documents /
// activeCases / pendingApprovals from live services; only totalUsers still
// consumes this seeded value.
export const MOCK_METRICS = {
  activeCases: 24,
  documents: 156,
  pendingApprovals: 8,
  totalUsers: 12
};

export const MOCK_RECENT_DOCUMENTS = [
  {
    id: 'doc-001',
    name: 'Investigation Report.pdf',
    type: 'PDF',
    variant: 'pdf-red',
    size: '1.2 MB',
    uploadedBy: 'Officer',
    date: '29 May 2026',
    time: '10:30 AM',
    caseId: 'CASE-2026-089',
    status: 'Verified'
  },
  {
    id: 'doc-002',
    name: 'FIR_2026_145.pdf',
    type: 'PDF',
    variant: 'pdf-blue',
    size: '850 KB',
    uploadedBy: 'Officer',
    date: '29 May 2026',
    time: '09:15 AM',
    caseId: 'FIR-2026-145',
    status: 'Verified'
  },
  {
    id: 'doc-003',
    name: 'Forensic_Report.pdf',
    type: 'PDF',
    variant: 'pdf-red',
    size: '2.4 MB',
    uploadedBy: 'Officer',
    date: '28 May 2026',
    time: '04:45 PM',
    caseId: 'CASE-2026-074',
    status: 'Pending Approval'
  },
  {
    id: 'doc-004',
    name: 'Crime_Scene_Photo.jpg',
    type: 'IMG',
    variant: 'img',
    size: '420 KB',
    uploadedBy: 'Officer',
    date: '28 May 2026',
    time: '02:20 PM',
    caseId: 'CASE-2026-081',
    status: 'Verified'
  },
  {
    id: 'doc-005',
    name: 'Forensic_Evidence_Scan.png',
    type: 'IMG',
    variant: 'img',
    size: '310 KB',
    uploadedBy: 'Officer',
    date: '28 May 2026',
    time: '11:05 AM',
    caseId: 'CASE-2026-065',
    status: 'Approved'
  }
];

export const MOCK_RECENT_ACTIVITY = [
  {
    id: 'act-001',
    action: 'Document uploaded',
    target: 'Investigation Report.pdf',
    date: '29 May 2026',
    time: '10:30 AM',
    iconType: 'blue',
    icon: 'Upload'
  },
  {
    id: 'act-002',
    action: 'Document viewed',
    target: 'FIR_2026_145.pdf',
    date: '29 May 2026',
    time: '09:15 AM',
    iconType: 'gold',
    icon: 'Eye'
  },
  {
    id: 'act-003',
    action: 'Approval requested',
    target: 'Forensic_Report.pdf',
    date: '29 May 2026',
    time: '08:40 AM',
    iconType: 'green',
    icon: 'CheckCircle'
  },
  {
    id: 'act-004',
    action: 'Approval granted',
    target: 'Forensic_Evidence_Scan.png',
    date: '28 May 2026',
    time: '05:10 PM',
    iconType: 'purple',
    icon: 'UserCheck'
  },
  {
    id: 'act-005',
    action: 'Access denied',
    target: 'Crime_Scene_Photo.jpg',
    date: '28 May 2026',
    time: '03:30 PM',
    iconType: 'red',
    icon: 'Lock'
  }
];

// ===== STEP 3 mock data: Cases & Approvals =====

// Step 12 — [PENDING] GET /api/cases/stats. Static seed until the stats
// endpoint is available from the backend.
export const CASE_STATS = {
  total: 24,
  active: 16,
  closed: 5,
  pending: 3
};

const BASE_CASES = [
  { code: 'CASE-2026-089', title: 'Cyber Financial Fraud Investigation', officer: 'Officer Khare', status: 'In Progress', nextHearing: '29 May 2026', docCount: 8, type: 'Case' },
  { code: 'FIR-2026-145', title: 'Cyber Intrusion & Data Exfiltration', officer: 'Officer Sharma', status: 'Under Review', nextHearing: '29 May 2026', docCount: 14, type: 'FIR' },
  { code: 'CASE-2026-074', title: 'Forensic Hardware Extraction', officer: 'Officer Patel', status: 'In Progress', nextHearing: '28 May 2026', docCount: 8, type: 'Case' },
  { code: 'CASE-2026-081', title: 'Witness Deposition & Affidavit', officer: 'Officer Verma', status: 'Archived', nextHearing: '25 May 2026', docCount: 11, type: 'Case' }
];

const EXTRA_CASE_TITLES = [
  'Digital Payment Scam Network',
  'Ransomware Seizure Operation',
  'Phone Forensics & CDR Analysis',
  'Dark Web Marketplace Takedown',
  'Illegal Interception Probe',
  'Crypto Laundering Trail'
];

const CASE_STATUSES = ['In Progress', 'Under Review', 'Pending', 'Archived'];

// NOTE (Step 12): MOCK_CASES is currently unused — caseService maintains its
// own INITIAL_CASE_DETAILS store. Kept as a reserved fixture for when the
// /api/cases endpoint is wired and richer seed data is needed.
export const MOCK_CASES = [
  ...BASE_CASES.map((c, i) => ({ id: `case-${i + 1}`, ...c })),
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `case-${i + 5}`,
    code: `CASE-2026-${String(70 - i).padStart(3, '0')}`,
    title: EXTRA_CASE_TITLES[i % EXTRA_CASE_TITLES.length],
    officer: ['Officer Khare', 'Officer Sharma', 'Officer Patel', 'Officer Verma'][i % 4],
    status: CASE_STATUSES[i % CASE_STATUSES.length],
    nextHearing: `${22 + (i % 7)} May 2026`,
    docCount: 3 + ((i * 3) % 15),
    type: 'Case'
  }))
];

const APPROVAL_TEMPLATES = [
  { document: 'Forensic_Report.pdf', docType: 'PDF', requestType: 'Classification Upgrade', requestedBy: 'Officer Khare' },
  { document: 'FIR_2026_145.pdf', docType: 'PDF', requestType: 'Court Disclosure Grant', requestedBy: 'Prosecutor Roy' },
  { document: 'Witness_Scan.jpg', docType: 'IMG', requestType: 'Redaction Exemption', requestedBy: 'Officer Sharma' },
  { document: 'CCTV_Snapshot.png', docType: 'IMG', requestType: 'Evidence Release', requestedBy: 'Investigator Patel' },
  { document: 'Charge_Sheet.pdf', docType: 'PDF', requestType: 'Sharing Authorization', requestedBy: 'Officer Verma' },
  { document: 'Lab_Report_Scan.jpg', docType: 'IMG', requestType: 'Access Permission', requestedBy: 'Analyst Mehta' },
  { document: 'Financial_Record_Scan.png', docType: 'IMG', requestType: 'Data Access Grant', requestedBy: 'Auditor Singh' }
];

export const MOCK_APPROVALS = Array.from({ length: 48 }, (_, i) => {
  const template = APPROVAL_TEMPLATES[i % APPROVAL_TEMPLATES.length];
  const status = i < 8 ? 'Pending' : i < 40 ? 'Approved' : 'Denied';
  return {
    id: `app-${i + 1}`,
    ...template,
    status,
    date: `${29 - (i % 8)} May 2026`,
    time: `${String(9 - (i % 9)).padStart(2, '0')}:${i % 2 ? '15' : '45'} ${i % 2 ? 'AM' : 'PM'}`
  };
});

