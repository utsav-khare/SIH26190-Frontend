// Case Service for managing case dockets, details, timelines, and linked documents.
//
// Step 12 — ALL case endpoints are PENDING from the backend team, so the
// localStorage-backed mock store below remains the active data source. The
// real branches are wired and will engage automatically once VITE_USE_MOCK=false:
//   GET  /api/cases                -> getCases()
//   GET  /api/cases/:id            -> getCaseById(id)
//   POST /api/cases                -> createCase(caseData)
//   POST /api/cases/:id/documents  -> addDocumentToCase(caseId, docData)

import { api } from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const STORAGE_KEY = 'vault_cases_v1';

export const INITIAL_CASE_DETAILS = [
  {
    id: 'case-1',
    code: 'DLW-2025-00078',
    title: 'Property boundary dispute between Ramesh Kumar & Suresh Patel',
    category: 'Property Law',
    type: 'Civil Dispute',
    status: 'Approved',
    priority: 'Medium',
    filedOn: '20 May 2025',
    lastUpdated: '05 Sep 2025, 10:30 AM',
    description: 'This case involves a dispute regarding the boundary of the residential property located at 45, Green Avenue, Indore, claimed by both parties.',
    location: 'Indore, Madhya Pradesh',
    court: 'Civil Court, Indore',
    tags: ['Property', 'Boundary Dispute'],
    officer: 'Anjali Sharma',
    assignedOfficer: {
      name: 'Anjali Sharma',
      designation: 'Legal Officer',
      department: 'Civil Legal Department',
      assignedOn: '21 May 2025',
      email: 'anjali.sharma@digilegal.in',
      phone: '+91 98765 43210'
    },
    timeline: [
      { step: 'Case Created', date: '20 May 2025', by: 'System', icon: 'FileText', color: 'gold' },
      { step: 'Assigned to Officer', date: '21 May 2025', by: 'Anjali Sharma', icon: 'User', color: 'blue' },
      { step: 'Under Review', date: '28 May 2025', by: 'Anjali Sharma', icon: 'Search', color: 'gold' },
      { step: 'Approved', date: '05 Sep 2025', by: 'Anjali Sharma', icon: 'Check', color: 'green' }
    ],
    documents: [
      { id: 'doc-c1', name: 'Complaint.pdf', type: 'Complaint', uploadedOn: '20 May 2025', uploadedBy: 'Ramesh Kumar', size: '1.4 MB' },
      { id: 'doc-c2', name: 'Property Deed.pdf', type: 'Supporting Document', uploadedOn: '21 May 2025', uploadedBy: 'Ramesh Kumar', size: '2.8 MB' },
      { id: 'doc-c3', name: 'Notice.pdf', type: 'Legal Notice', uploadedOn: '22 May 2025', uploadedBy: 'Court', size: '650 KB' },
      { id: 'doc-c4', name: 'Reply.pdf', type: 'Response', uploadedOn: '25 May 2025', uploadedBy: 'Suresh Patel', size: '920 KB' },
      { id: 'doc-c5', name: 'Order.pdf', type: 'Court Order', uploadedOn: '05 Sep 2025', uploadedBy: 'Court', size: '1.1 MB' }
    ]
  },
  {
    id: 'case-2',
    code: 'CASE-2026-089',
    title: 'Cyber Financial Fraud Investigation',
    category: 'Cybercrime',
    type: 'Case',
    status: 'In Progress',
    priority: 'High',
    filedOn: '29 May 2026',
    lastUpdated: '29 May 2026, 04:15 PM',
    description: 'Multi-jurisdictional cyber phishing and illegitimate wire transfer operation targeting digital banking customers.',
    location: 'New Delhi, India',
    court: 'Cyber Appellate Tribunal, Delhi',
    tags: ['Cyber', 'Financial Fraud', 'Banking'],
    officer: 'Officer Khare',
    assignedOfficer: {
      name: 'Officer Khare',
      designation: 'Senior Legal Officer',
      department: 'Cyber Crime & Legal Division',
      assignedOn: '29 May 2026',
      email: 'officer.khare@digilegal.in',
      phone: '+91 98111 22334'
    },
    timeline: [
      { step: 'Case Created', date: '29 May 2026', by: 'System', icon: 'FileText', color: 'gold' },
      { step: 'Assigned to Officer', date: '29 May 2026', by: 'Officer Khare', icon: 'User', color: 'blue' },
      { step: 'Under Review', date: '29 May 2026', by: 'Officer Khare', icon: 'Search', color: 'gold' },
      { step: 'Pending Hearing', date: '02 Jun 2026', by: 'Cyber Tribunal', icon: 'Hourglass', color: 'blue' }
    ],
    documents: [
      { id: 'doc-c2-1', name: 'Investigation Report.pdf', type: 'Investigation Report', uploadedOn: '29 May 2026', uploadedBy: 'Officer Khare', size: '1.2 MB' },
      { id: 'doc-c2-2', name: 'Transaction_Ledger.pdf', type: 'Evidence Record', uploadedOn: '29 May 2026', uploadedBy: 'Bank Auditor', size: '3.4 MB' },
      { id: 'doc-c2-3', name: 'IP_Tracing_Log.pdf', type: 'Technical Forensic', uploadedOn: '29 May 2026', uploadedBy: 'Cyber Analyst', size: '890 KB' }
    ]
  },
  {
    id: 'case-3',
    code: 'FIR-2026-145',
    title: 'Cyber Intrusion & Data Exfiltration',
    category: 'Information Security',
    type: 'FIR',
    status: 'Under Review',
    priority: 'Critical',
    filedOn: '29 May 2026',
    lastUpdated: '29 May 2026, 09:15 AM',
    description: 'Unauthorized penetration into corporate database with encrypted payload extraction and extortion threats.',
    location: 'Bangalore, Karnataka',
    court: 'Sessions Court, Bangalore',
    tags: ['Intrusion', 'Data Breach', 'FIR'],
    officer: 'Officer Sharma',
    assignedOfficer: {
      name: 'Officer Sharma',
      designation: 'Lead Cyber Investigator',
      department: 'Digital Forensics Unit',
      assignedOn: '29 May 2026',
      email: 'officer.sharma@digilegal.in',
      phone: '+91 98222 33445'
    },
    timeline: [
      { step: 'FIR Lodged', date: '29 May 2026', by: 'Complainant', icon: 'FileText', color: 'gold' },
      { step: 'Assigned to Officer', date: '29 May 2026', by: 'Officer Sharma', icon: 'User', color: 'blue' },
      { step: 'Under Review', date: '29 May 2026', by: 'Forensic Lab', icon: 'Search', color: 'gold' }
    ],
    documents: [
      { id: 'doc-c3-1', name: 'FIR_2026_145.pdf', type: 'Official FIR', uploadedOn: '29 May 2026', uploadedBy: 'Station Officer', size: '850 KB' },
      { id: 'doc-c3-2', name: 'Server_Audit_Trace.pdf', type: 'Forensic Log', uploadedOn: '29 May 2026', uploadedBy: 'Security Auditor', size: '4.1 MB' }
    ]
  },
  {
    id: 'case-4',
    code: 'CASE-2026-074',
    title: 'Forensic Hardware Extraction',
    category: 'Forensic Evidence',
    type: 'Case',
    status: 'In Progress',
    priority: 'Medium',
    filedOn: '28 May 2026',
    lastUpdated: '28 May 2026, 04:45 PM',
    description: 'Hardware acquisition, memory dump extraction, and cryptographic decryption of seized cold wallets.',
    location: 'Mumbai, Maharashtra',
    court: 'High Court of Bombay',
    tags: ['Hardware', 'Decryption', 'Seizure'],
    officer: 'Officer Patel',
    assignedOfficer: {
      name: 'Officer Patel',
      designation: 'Forensic Specialist',
      department: 'Hardware Extraction Unit',
      assignedOn: '28 May 2026',
      email: 'officer.patel@digilegal.in',
      phone: '+91 98333 44556'
    },
    timeline: [
      { step: 'Case Created', date: '28 May 2026', by: 'System', icon: 'FileText', color: 'gold' },
      { step: 'Assigned to Officer', date: '28 May 2026', by: 'Officer Patel', icon: 'User', color: 'blue' },
      { step: 'Extraction In Progress', date: '28 May 2026', by: 'Hardware Lab', icon: 'Search', color: 'gold' }
    ],
    documents: [
      { id: 'doc-c4-1', name: 'Forensic_Report.pdf', type: 'Lab Report', uploadedOn: '28 May 2026', uploadedBy: 'Officer Patel', size: '2.4 MB' }
    ]
  },
  {
    id: 'case-5',
    code: 'CASE-2026-081',
    title: 'Witness Deposition & Affidavit Archive',
    category: 'Civil Dispute',
    type: 'Case',
    status: 'Archived',
    priority: 'Low',
    filedOn: '25 May 2026',
    lastUpdated: '28 May 2026, 02:20 PM',
    description: 'Archive of recorded witness depositions and notarized affidavits in commercial contract litigation.',
    location: 'Hyderabad, Telangana',
    court: 'Commercial Court, Hyderabad',
    tags: ['Witness', 'Affidavit', 'Archived'],
    officer: 'Officer Verma',
    assignedOfficer: {
      name: 'Officer Verma',
      designation: 'Senior Registrar',
      department: 'Civil Documentation',
      assignedOn: '25 May 2026',
      email: 'officer.verma@digilegal.in',
      phone: '+91 98444 55667'
    },
    timeline: [
      { step: 'Case Created', date: '25 May 2026', by: 'System', icon: 'FileText', color: 'gold' },
      { step: 'Assigned to Officer', date: '25 May 2026', by: 'Officer Verma', icon: 'User', color: 'blue' },
      { step: 'Depositions Completed', date: '27 May 2026', by: 'Officer Verma', icon: 'Check', color: 'green' },
      { step: 'Archived', date: '28 May 2026', by: 'System', icon: 'Check', color: 'green' }
    ],
    documents: [
      { id: 'doc-c5-1', name: 'Witness_Statement.docx', type: 'Deposition', uploadedOn: '28 May 2026', uploadedBy: 'Officer Verma', size: '420 KB' }
    ]
  }
];

// Helper to load cases from localStorage or fallback
const getStoredCases = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read cases from localStorage', e);
  }
  return INITIAL_CASE_DETAILS;
};

// Helper to save cases to localStorage
const saveStoredCases = (cases) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (e) {
    console.error('Failed to write cases to localStorage', e);
  }
};

export const caseService = {
  /**
   * Fetch all case dockets.
   * Mock: localStorage-backed store.
   * Real: GET /api/cases  [PENDING — backend endpoint not yet available]
   */
  async getCases() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getStoredCases();
    }
    return api.get('/cases');
  },

  /**
   * Fetch a single case by id or docket code.
   * Mock: localStorage-backed store.
   * Real: GET /api/cases/:id  [PENDING — backend endpoint not yet available]
   */
  async getCaseById(idOrCode) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      const cases = getStoredCases();
      const found = cases.find(
        (c) => c.id === idOrCode || c.code === idOrCode || c.code.toLowerCase() === String(idOrCode).toLowerCase()
      );
      return found || cases[0];
    }
    return api.get(`/cases/${idOrCode}`);
  },

  /**
   * Create a new case docket.
   * Mock: prepends to the localStorage-backed store.
   * Real: POST /api/cases  -> created case
   *       [PENDING — backend endpoint not yet available]
   */
  async createCase(caseData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const cases = getStoredCases();
      const newCase = {
        id: `case-${Date.now()}`,
        code: caseData.caseCode || `CASE-2026-${String(cases.length + 1).padStart(3, '0')}`,
        title: caseData.caseTitle || 'Untitled Case Docket',
        category: caseData.category || 'General Legal',
        type: caseData.type || 'Case',
        status: 'In Progress',
        priority: caseData.priority || 'Medium',
        filedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        lastUpdated: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        description: caseData.description || 'New legal docket created.',
        location: caseData.location || 'Jurisdiction Court',
        court: caseData.court || 'Civil / Criminal Court',
        tags: caseData.tags || ['New', 'Case'],
        officer: caseData.leadOfficer || 'Officer Khare',
        assignedOfficer: {
          name: caseData.leadOfficer || 'Officer Khare',
          designation: 'Assigned Legal Officer',
          department: 'Legal Department',
          assignedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          email: 'officer.assigned@digilegal.in',
          phone: '+91 98765 00000'
        },
        timeline: [
          { step: 'Case Created', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), by: 'System', icon: 'FileText', color: 'gold' },
          { step: 'Assigned to Officer', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), by: caseData.leadOfficer || 'Officer', icon: 'User', color: 'blue' }
        ],
        documents: []
      };
      const updated = [newCase, ...cases];
      saveStoredCases(updated);
      return newCase;
    }
    return api.post('/cases', caseData);
  },

  /**
   * Link a document to a case docket.
   * Mock: prepends to the case's document list in the localStorage store.
   * Real: POST /api/cases/:id/documents  -> created case document
   *       [PENDING — backend endpoint not yet available]
   */
  async addDocumentToCase(caseId, docData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const cases = getStoredCases();
      let updatedDoc = null;
      const updated = cases.map((c) => {
        if (c.id === caseId || c.code === caseId) {
          updatedDoc = {
            id: `doc-${Date.now()}`,
            name: docData.name || 'Document.pdf',
            type: docData.type || 'Supporting Document',
            uploadedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            uploadedBy: docData.uploadedBy || 'Officer',
            size: docData.size || '1.0 MB'
          };
          return {
            ...c,
            documents: [updatedDoc, ...(c.documents || [])],
            lastUpdated: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
          };
        }
        return c;
      });
      saveStoredCases(updated);
      return updatedDoc;
    }
    return api.post(`/cases/${caseId}/documents`, docData);
  }
};

