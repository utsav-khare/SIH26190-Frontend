1. Problem Statement — SIH26190
The project is a Secure Digital Document Management System for legal and investigation documents.
Police and investigation departments handle many sensitive documents like FIRs, reports, evidence, and forensic files.
Managing these documents manually can make them difficult to store, find, share, and track.
Our system keeps these documents in one secure digital platform.
Only authorized users should be able to access or modify sensitive documents.
The main goal is to make document management secure, fast, organized, and easy.

UI/UX Design
⬇️
Analyze UI/UX Design
⬇️
Set Up React + Vite Project
⬇️
Create React Components & Pages
⬇️
Implement UI/UX in React
⬇️
React Router & Navigation
⬇️
Run & Test Frontend in Browser
⬇️
Clean & Refactor React Code
⬇️
Create API Service Layer
⬇️
Authentication & Login API
⬇️
Protected Routes & Session Management
⬇️
Dashboard API Integration
⬇️
Document List API
⬇️
Search & Filter APIs
⬇️
Upload Document API
⬇️
View & Download Document API
⬇️
Update Document / Metadata API
⬇️
Delete Document API
⬇️
Role & Permission Workflow
⬇️
Loading / Success / Empty / Error States
⬇️
Connect All Workflows Together
⬇️
Replace Mock Data with Real APIs
⬇️
End-to-End Testing
⬇️
Final Bug Fixing & Optimization

STEP 1
I am providing the UI/UX design for my SIH26190 Secure Digital Document Management System.

Analyze the complete design carefully before writing any code.

Identify:
- All pages/screens
- Navigation flow
- Reusable UI components
- Forms and input fields
- Buttons and their actions
- Cards, tables, modals and dropdowns
- Login/authentication screens
- Dashboard sections
- Document-related screens
- User roles and permissions visible in the design
- Responsive/mobile requirements

For now, ONLY analyze the design.
Do not write code yet.
Do not change or create project files yet.

STEP 2

Now create the frontend using React with Vite based on the UI/UX design I provided.

Requirements:
- Use React + Vite
- Use JavaScript unless the existing project already uses TypeScript
- Create a clean and scalable folder structure
- Use reusable React components
- Set up React Router for page navigation
- Separate pages, components, services, hooks, utilities and assets
- Keep the architecture suitable for future API integration
- Do not implement backend/API functionality yet
- Do not invent unnecessary features

Before making changes, inspect the existing project and preserve useful existing files.
After implementation, make sure the project can run successfully.

STEP 3

Now implement the complete UI/UX design using React components.

Requirements:
- Match the provided UI/UX design as accurately as possible
- Create all required pages
- Create reusable components
- Implement navigation using React Router
- Implement forms, buttons, modals, dropdowns and interactions
- Make the application responsive
- Keep components modular and maintainable
- Use mock/static data wherever dynamic data is required
- Do NOT connect real APIs yet
- Do NOT create fake backend functionality

Focus on reproducing the UI/UX and frontend interactions first.

STEP 4

Now run the React + Vite application locally.

Check the complete application in the browser.

Verify:
- Every page loads
- Navigation works
- Components render correctly
- Buttons and forms work
- Responsive layout works
- No console errors
- No build errors
- No broken imports
- No missing assets

If you find errors, fix them.

Do not start API integration yet.
The goal is to make the complete frontend UI stable and runnable.

STEP 5
Now review the React frontend code for maintainability.

Check for:
- Duplicate components
- Duplicate CSS
- Unnecessary code
- Incorrect component structure
- Hardcoded repeated values
- Poor folder organization
- Unnecessary state
- Incorrect React patterns
- Broken or unused imports

Refactor only where necessary.

Do not change the UI/UX appearance or functionality.
Do not add API integration yet.

STEP 6

Now prepare the React frontend for backend API integration.

Create a centralized API/service layer.

Requirements:
- Central API base URL configuration
- Use environment variables
- Reusable HTTP request methods
- GET, POST, PUT/PATCH and DELETE support
- Authentication/token handling
- Centralized API error handling
- Request/response handling
- Loading and error state support
- Keep API logic separate from React UI components

Do not put API calls directly inside every component.

Do not invent backend endpoints.
If an endpoint is not provided by the backend team, mark it clearly as pending/placeholder.

STEP 7

Now implement the frontend authentication workflow using the backend API.

Workflow:

Login page
→ User enters credentials
→ Frontend validates input
→ API request
→ Backend response
→ Authentication state/token
→ Redirect to dashboard

Also implement:
- Invalid credentials
- API/server errors
- Loading state
- Logout
- Session expiration
- Protected routes

Keep authentication logic separate from UI components.

STEP 8

Now connect the dashboard to the backend APIs.

Replace the existing mock/static dashboard data with API-driven data where backend endpoints are available.

Implement:
- API request
- Loading state
- Successful response
- Empty state
- Error state
- Data rendering

Keep the existing UI/UX design unchanged.
Do not duplicate API logic inside components.

STEP 9

Now integrate the document management workflow with the backend APIs.

Implement:

Fetch Documents
→ Display Document List

Search Documents
→ Send Search Request
→ Receive Results
→ Update UI

Filter Documents
→ Apply Filters
→ Request/Process Results
→ Update UI

Upload Document
→ Select File
→ Validate
→ Send to Backend
→ Handle Response
→ Show Success/Error
→ Refresh Document List

Document Details
→ Request Details
→ Display Response

Download/View Document
→ Request Backend Resource
→ Handle Response

Update Metadata
→ Edit Metadata
→ Send Update
→ Handle Response
→ Refresh UI

Delete Document
→ Check Permission
→ Confirm Action
→ API Request
→ Handle Response

Use the existing API service layer.
Do not put direct API logic throughout UI components.


STEP10

Now implement the frontend role and permission workflow.

Based on the user's role/permissions returned by the backend, control access to:

- View document
- Upload document
- Edit document
- Download document
- Delete document
- Share document
- View audit/history

Create reusable permission-checking logic.

Important:
Frontend permissions are only for UI/UX.
The backend remains the final authority for security and authorization.

STEP 11

Now implement consistent API state handling across the application.

Handle:

Loading
Success
Empty response
Validation error
401 Unauthorized
403 Forbidden
404 Not Found
500 Server Error
Network error
Session expiration

Create reusable mechanisms/components/hooks where appropriate.

Make sure API errors are presented clearly to the user without breaking the application.

STEP 12

Now review the entire React application and identify all remaining mock/static data that should come from the backend.

Replace the mock data with real API integration wherever the corresponding backend endpoint is available.

Do not remove mock data where the backend endpoint is not yet available.

Clearly identify any remaining API dependencies.

STEP 13

Perform a complete end-to-end test of the SIH26190 React frontend.

Test this workflow:

Login
↓
Authentication
↓
Dashboard
↓
Document List
↓
Search
↓
Filter
↓
Upload Document
↓
Document Details
↓
View/Download
↓
Edit Metadata
↓
Permission Check
↓
Logout

For every workflow verify:
- Correct API request
- Correct request data
- Correct response handling
- Authentication
- Authorization
- Loading state
- Error state
- Empty state
- Navigation
- UI update

Check for:
- Console errors
- Build errors
- Broken imports
- Failed API calls
- Incorrect state management
- Duplicate API calls
- Security-related frontend mistakes

Fix identified issues without unnecessarily changing the established UI/UX.

STEP 14

UI/UX Design
      ↓
1. Analyze Design
      ↓
2. Setup React + Vite
      ↓
3. Build UI with React
      ↓
4. Run in Browser
      ↓
5. Test & Refactor
      ↓
6. API Service Layer
      ↓
7. Authentication API
      ↓
8. Dashboard API
      ↓
9. Document APIs
      ↓
10. Search / Filter / Upload / Download
      ↓
11. Role & Permission Workflow
      ↓
12. Error + Loading Handling
      ↓
13. Replace Mock Data
      ↓
14. End-to-End Testing