# NMIMS Veriedu

A React + Vite web application for managing verification requests across applicants, third-party users, and administrators. The app provides dedicated flows for document submission, verification tracking, admin review, and reporting.

## Highlights

- **Applicant flow:** signup, document verification submission, and status tracking.
- **Third-party flow:** login/registration, dashboard access, and application submission.
- **Admin flow:** authentication, verification review, and reporting.
- **Responsive UI:** built with shadcn/ui, Radix UI primitives, and Tailwind CSS.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **UI:** shadcn/ui, Radix UI, Tailwind CSS
- **State/Data:** React Query, React Hook Form, Zod

## Project Structure

```
src/
  components/        Reusable UI components
  hooks/             Custom React hooks
  lib/               Utilities and shared helpers
  pages/             Route-based pages (applicant, third-party, admin)
  App.tsx            Route definitions
  main.tsx           App bootstrap
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm (or your preferred package manager)

### Install & Run

```sh
# Clone the repository

git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the production bundle
- `npm run build:dev` — Build with development mode config
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint

## Routing Overview

Key routes are defined in `src/App.tsx`:

- `/` — Landing page
- `/signup` — Applicant signup
- `/verify-document` — Applicant document verification
- `/user-dashboard` — Applicant dashboard
- `/third-party/login` — Third-party login
- `/third-party/register` — Third-party registration
- `/third-party/dashboard` — Third-party dashboard
- `/third-party/apply` — Third-party application
- `/admin/login` — Admin login
- `/admin/dashboard` — Admin dashboard
- `/admin/verification/:id` — Verification review
- `/admin/reports` — Reports
