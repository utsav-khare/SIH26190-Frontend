# Digilegal Vault — Secure Document Management System

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-gray)](https://opensource.org/licenses/MIT)

A role-based document vault / case management application built with React and Vite. All backend endpoints are currently stubbed with realistic mock data; real API wiring is in place and activated by setting `VITE_USE_MOCK=false`.

---

## Project Context

**Project:** SIH26190 — Digilegal Vault
**Stack:** React 18 · Vite 5 · react-router-dom 6 · lucide-react
**Node runtime:** Node ≥ 18 (ESM, `"type": "module"`)
**Source root:** `src/` · **dev server:** http://localhost:3000
**Build:** `npm run build` (Vite production build); `npm run preview` to serve the production bundle locally

---

## Getting Started

### Prerequisites

- **Node.js ≥ 18** — verify with `node -v`
- **npm** (bundled with Node) — the project uses `"type": "module"`, so `.js` files are treated as ES modules

### Installation

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure environment — copy .env.example → .env and adjust
cp .env.example .env

# 3. Start the development server
npm run dev        # opens http://localhost:3000 automatically
```

### Environment Variables

All client-exposed variables must be prefixed with `VITE_`. Copy `.env.example` to `.env` and adjust as needed:

| Variable | Default | Description |
|---|---|---|
## Architecture

### Folder structure

```
SIH26190/
├── public/              # Static assets served as-is
├── src/
│   ├── main.jsx         # React 18 root + StrictMode + Router
│   ├── App.jsx          # Route definitions (lazy-loaded pages)
│   ├── index.css       # Global CSS reset + CSS variables (design tokens)
│   ├── hooks/
│   │   ├── useApi.js        # Generic fetch hook { data, loading, error, execute, reset }
│   │   ├── useApiData.js    # Load-on-mount convenience hook on top of useApi
│   │   ├── useAuth.jsx      # Auth context consumer
│   │   └── useModal.js      # Modal open/close helper
│   ├── utils/
│   │   ├── constants.js     # SUPPORTED_UPLOAD, PERMISSION_LABELS, FEATURE_FLAG_*, MOCK_CONFIG
│   │   └── permissions.js   # PERMISSIONS set + hasPermission(...) RBAC helper
│   ├── services/
│   │   ├── api.js           # Central fetch wrapper + HTTP status → user message mapping
│   │   ├── authService.js   # login / logout / session verification (mock + real)
│   │   ├── documentService.js  # Documents CRUD + file download (mock + real)
│   │   ├── caseService.js   # Cases CRUD + document-to-case attach (mock + real)
│   │   ├── approvalService.js  # Approvals list + decision (mock + real)
│   │   └── auditService.js  # Audit log + recent activity (mock + real)
│   ├── context/
│   │   └── AuthContext.jsx  # AuthProvider: { user, loading, login, logout }
│   ├── components/
│   │   ├── common/          # Button, Badge, Modal, EmptyState, LoadingState, ErrorState
│   │   ├── modals/          # UploadModal, DocumentPreviewModal, EditMetadataModal,
│   │   │                      NewCaseModal, AboutModal
│   │   ├── dashboard/       # StatCard, ActivityTimeline, QuickActionGrid, RecentDocuments
│   │   └── layout/          # Topbar, Sidebar, DashboardLayout
│   ├── pages/              # Route components (Landing, Login, Dashboard, Documents, Cases,
│   │                         Search, Approvals, AuditLog, Settings, CaseDetail)
│   └── styles/             # Dashboard, auth, landing, global CSS
├── .env.example            # Environment template
├── package.json
├── vite.config.js          # Vite config (vendor chunk splitting enabled)
└── README.md
```

### Data flow

1. **Pages** call service functions (always through `useApiData` for reads, `try/catch` for mutations).
2. **Services** call `api.js` (`request(...)`), which maps HTTP status codes to user-friendly error strings and clears stale session tokens on 401.
3. **Auth** is held in `AuthContext` (`user`, `loading`). Pages and modals read the current user through `useAuth()` and gate UI with `hasPermission(user?.role, PERMISSION)`.
4. **Mock/real branching:** each service keeps a mock implementation and, when `VITE_USE_MOCK=false`, calls the real endpoint. Mock data is seeded in the service itself (except `MOCK_CASES` / `MOCK_METRICS` / `MOCK_APPROVALS` / `MOCK_RECENT_ACTIVITY`, which are documented as reserved fixtures until replaced by the matching endpoints).

### Key design decisions

- **RBAC is enforced in the UI** using `hasPermission` + `PERMISSIONS`. Admin gets all 8 permissions; Officer lacks delete/approve/manage-users; Attorney sees view + download only. Backend authority checks are required in real mode (documented in the audit).
- **No secrets in the bundle.** Credentials, tokens, and API keys live in `.env` (never committed) and are prefixed with `VITE_` so they reach the client intentionally.
- **Upload safety (client-side):** file type auto-detected against an allow-list (`SUPPORTED_UPLOAD`), size capped at 50 MB. Backend must re-validate on real uploads.
- **Optimistic updates with rollback:** Approvals decisions update the list immediately and revert on failure; document add/edit/update follow the same pattern with error alerts.

---

## Demo Accounts (Mock Mode)

Mock authentication uses several demo accounts so the full RBAC matrix is testable. Password for all accounts: **`vault2026`**.

| Role | Email | Permissions |
|---|---|---|
| Admin | `admin@firm.com` | All 8 permissions |
| Officer | `officer@firm.com` | Upload, view, download, edit (no delete / no approve / no manage-users) |
| Attorney (legacy Officer) | `attorney@firm.com` | View + download only |
| Advocate (Attorney) | `advocate@firm.com` | View + download only |

The credentials box on the login page lists these accounts.

---

## Pending Backend Endpoints

The following real endpoints are wired in the service layer but **not yet available** — the app continues to use mock data until they are implemented (`VITE_USE_MOCK=false` will surface `ErrorState` for these until then).

| Service | Endpoint | Notes |
|---|---|---|
| `documentService` | `GET /api/documents` | List all documents |
| `documentService` | `POST /api/documents` | Create document record |
| `documentService` | `GET /api/documents/:id` | Single document |
| `documentService` | `PUT /api/documents/:id` | Update document metadata |
| `documentService` | `GET /api/documents/:id/file` | File download / stream |
| `documentService` | `DELETE /api/documents/:id` | Delete document |
| `caseService` | `GET /api/cases` | List cases |
| `caseService` | `POST /api/cases` | Create case |
| `caseService` | `GET /api/cases/:id` | Case detail |
| `caseService` | `POST /api/cases/:id/documents` | Attach document to case |
| `caseService` | `GET /api/cases/:id/documents` | Case documents |
| `authService` | `POST /api/auth/login` | Credentials login |
| `authService` | `GET /api/auth/me` | Session verification |
| `authService` | `POST /api/auth/logout` | End session |
| `approvalService` | `GET /api/approvals` | Pending approvals list |
| `approvalService` | `POST /api/approvals/:id/decision` | Approve / reject |
| `auditService` | `GET /api/audit-logs` | Audit log |
| `auditService` | `GET /api/activity/recent` | Recent activity |

Also to be wired when available: `GET /api/cases/stats` (case statistics) and `GET /api/users` / `GET /api/users/me` / `GET /api/settings` (Dashboard metrics + Settings page).

---

## Testing

1. Open http://localhost:3000 and log in with one of the demo accounts above.
2. Walk the full workflow: Dashboard → Documents → Search → Filter → Upload → Details → View/Download → Edit Metadata → Permission checks → Logout.
3. Switch roles (log out, log in as another account) to confirm RBAC gating.
4. Toggle `VITE_USE_MOCK=false` in `.env` (restart the dev server) once the backend is available to confirm real endpoints.

See `E2E_Test_Report.md` for the full end-to-end checklist and the fixes applied during Step 13.

---

## License

MIT


| `VITE_API_URL` | `/api` | Backend API base URL. Use `/api` when a Vite dev proxy forwards to the backend (recommended for local development). |
| `VITE_USE_MOCK` | `true` | When `true`, every service call uses in-memory mock data. Set to `false` to enable real API calls once the backend is available. |
| `VITE_APP_NAME` | `Digilegal Vault` | Optional application display name override. |

For example, to point the app at a remote backend:

```bash
# .env
VITE_API_URL=https://api.your-domain.com
VITE_USE_MOCK=false
```

### Building for Production

```bash
npm run build      # produces dist/ with chunked JS (vendor + app bundles)
npm run preview    # serves the production build locally for a final check
```

---


# Frontend-SIH26190