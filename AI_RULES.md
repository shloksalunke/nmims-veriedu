# AI Development Rules for NMIMS Verification Portal

## Tech Stack Overview

- **Framework**: React 18 with TypeScript for type-safe UI development
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router v6 for client-side navigation
- **Styling**: Tailwind CSS with custom NMIMS design system
- **UI Components**: shadcn/ui library built on Radix UI primitives
- **State Management**: React Query (TanStack Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React icon library
- **Local Storage**: In-browser localStorage for data persistence
- **Notifications**: Sonner and Radix UI Toast for user feedback

## Library Usage Rules

### ✅ Approved Libraries & When to Use Them

- **shadcn/ui components**: Use for all standard UI elements (buttons, cards, tables, etc.)
- **React Hook Form**: Use for all form handling and validation
- **Zod**: Use for all data validation schemas
- **React Query**: Use for data fetching, caching, and state management
- **Lucide React**: Use for all icons throughout the application
- **Tailwind CSS**: Use for all styling and responsive design
- **React Router**: Use for all client-side routing

### ⛔️ Restricted Libraries & Alternatives

- **No Redux/MobX**: Use React Query for server state and React Context for local state
- **No Bootstrap/Material UI**: Use shadcn/ui and Tailwind CSS for all UI needs
- **No Axios/Fetch wrappers**: Use React Query's built-in fetch capabilities
- **No class-based components**: Use functional components with hooks
- **No jQuery**: Use vanilla JavaScript or React utilities
- **No external state management**: Use React Query + Context API

### 🎯 Component Architecture Rules

1. **Always create new files**: Each component must be in its own file
2. **Use TypeScript**: All components must have type annotations
3. **Follow shadcn patterns**: New components should match shadcn/ui structure
4. **Mobile-first design**: All UI must be responsive using Tailwind classes
5. **Accessibility**: All components must follow a11y best practices
6. **No inline styles**: Use Tailwind classes exclusively
7. **Component composition**: Favor composition over complex components

### 📁 File Organization

- **Pages**: `src/pages/` - One file per route
- **Components**: `src/components/` - Reusable UI components
- **Hooks**: `src/hooks/` - Custom React hooks
- **Lib**: `src/lib/` - Utility functions and business logic
- **UI**: `src/components/ui/` - shadcn/ui components (do not modify)

### 🧪 Testing Guidelines

- **Manual testing**: Always test in the preview environment
- **Cross-browser**: Check functionality in Chrome, Firefox, Safari
- **Responsive**: Test on mobile, tablet, and desktop views
- **Form validation**: Ensure all user inputs are properly validated
- **Error handling**: Verify error states display appropriate messages