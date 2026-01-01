# Task Management System

A full-stack task management application built with Next.js 16, featuring JWT authentication, role-based access control (RBAC), and a comprehensive REST API.

## Features

### Authentication & Security
- JWT-based authentication with HTTP-only cookies
- Secure password hashing using bcrypt
- Role-based access control (User & Admin roles)
- Protected routes with middleware
- Input validation and sanitization
- Session management with 7-day expiration

### Task Management
- Complete CRUD operations for tasks
- Task filtering by status and priority
- Pagination support for large datasets
- Due date tracking and overdue detection
- Activity logging for audit trails
- Real-time task statistics and analytics

### Admin Panel
- User management (view, update role, delete)
- Paginated user listing
- Role assignment and permission management
- Protected admin-only routes

### API & Documentation
- RESTful API design with versioning (v1)
- Interactive Swagger UI documentation (`/docs`)
- Postman collection included
- Comprehensive error handling
- Standardized response formats

### UI/UX
- Modern, responsive design with Tailwind CSS
- shadcn/ui component library
- Dashboard with statistics and activity feed
- Collapsible sidebar navigation
- Light/dark mode support (optional)
- Mobile-first responsive layout
