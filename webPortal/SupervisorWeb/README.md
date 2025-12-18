# HazardEye Supervisor Web Portal

A comprehensive frontend-only web portal for supervisors and employees to manage industrial safety incidents and tasks.

## Features

- **Incident Reports Dashboard**: View, filter, and manage safety incidents
- **Incident Detail View**: Detailed view with AI recommendations
- **Task Assignment**: Create tasks from incidents (Supervisor only)
- **Task Management**: Track and update task status with comments
- **AI Safety Recommendations**: Professional AI-generated safety advisories
- **Role-based UI**: Switch between Supervisor and Employee views
- **Advanced Filtering**: Multi-select filters for time, area, severity, department, and status

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Recharts for data visualization
- Lucide React for icons
- date-fns for date formatting

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Sidebar, Header, MainLayout)
│   ├── UI/             # Basic UI components (Button, Card, Badge, Modal)
│   ├── Filters/        # Filter components
│   ├── AIRecommendationPanel.tsx
│   └── TaskAssignmentModal.tsx
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── IncidentReports.tsx
│   ├── IncidentDetail.tsx
│   ├── Tasks.tsx
│   └── TaskDetail.tsx
├── context/            # React Context providers
│   └── AppContext.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── data/               # Mock data generators
│   └── mockData.ts
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Key Features

### Role Management

- Toggle between Supervisor and Employee roles in the header
- Different permissions and views based on role
- Employees only see their assigned tasks

### Incident Management

- View incidents in grid or list view
- Filter by time range, area, severity, department, and status
- Detailed incident view with AI recommendations
- Download incident images

### Task Management

- Create tasks from incidents (Supervisor)
- Update task status with delay reasons
- Add comments to tasks
- View activity timeline
- Filter by status and priority

### AI Recommendations

- Professional safety recommendations panel
- What to do, why it matters, risk explanation
- Preventive steps with numbered list
- Color-coded sections for visual hierarchy

## Mock Data

The application uses mock data generated in `src/data/mockData.ts`. All data is stored in React Context and persists during the session. No backend connection is required.

## Notes

- This is a **frontend-only** application
- All data is stored in React state (no persistence)
- No authentication is implemented (role switching is UI-only)
- Images are loaded from external sources (Picsum Photos)
- Ready to be connected to a real backend API
