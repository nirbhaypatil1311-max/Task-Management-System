# API Documentation

## Overview

The Task Management API is a RESTful API built with Next.js that provides comprehensive task management functionality with authentication, role-based access control, and activity tracking.

## Base URL

**Development:** `http://localhost:3000/api/v1`  
**Production:** `https://your-domain.com/api/v1`

## API Versioning

The API uses URL-based versioning. The current version is `v1`, accessible at `/api/v1/*`.

Future versions will be available at `/api/v2/*`, `/api/v3/*`, etc., allowing clients to migrate at their own pace.

## Authentication

The API uses JWT (JSON Web Token) authentication stored in HTTP-only cookies for security.

### Authentication Flow

1. **Sign Up**: Create a new account via `POST /api/v1/auth/signup`
2. **Login**: Authenticate via `POST /api/v1/auth/login` - receives JWT token in cookie
3. **Access Protected Routes**: Include cookie automatically on subsequent requests
4. **Logout**: Clear session via `POST /api/v1/auth/logout`

### Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production
- SameSite policy for CSRF protection

## Role-Based Access Control (RBAC)

The API supports two user roles:

- **user**: Standard user with access to own tasks
- **admin**: Full access including user management

Admin-only endpoints are prefixed with `/api/v1/admin/*`.

## API Endpoints

### Authentication Endpoints

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "message": "Signup successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "role": "user"
  }
}
```

#### GET /auth/me
Get current authenticated user profile.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /auth/logout
Logout current user and clear session.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### Task Endpoints

#### GET /tasks
Get all tasks for the authenticated user with pagination and filtering.

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 10) - Items per page
- `status` (string, optional) - Filter by status: `todo`, `in-progress`, `completed`
- `priority` (string, optional) - Filter by priority: `low`, `medium`, `high`

**Response (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs",
      "status": "in-progress",
      "priority": "high",
      "due_date": "2026-01-15T10:00:00Z",
      "user_id": 1,
      "created_at": "2026-01-01T10:00:00Z",
      "updated_at": "2026-01-02T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-01-15T10:00:00Z"
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "todo",
    "priority": "high",
    "due_date": "2026-01-15T10:00:00Z",
    "user_id": 1,
    "created_at": "2026-01-01T10:00:00Z",
    "updated_at": "2026-01-01T10:00:00Z"
  }
}
```

#### GET /tasks/{id}
Get a specific task by ID.

**Response (200):**
```json
{
  "task": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in-progress",
    "priority": "high",
    "due_date": "2026-01-15T10:00:00Z",
    "user_id": 1,
    "created_at": "2026-01-01T10:00:00Z",
    "updated_at": "2026-01-02T15:30:00Z"
  }
}
```

#### PATCH /tasks/{id}
Update an existing task.

**Request Body (partial update):**
```json
{
  "status": "completed",
  "priority": "medium"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "completed",
    "priority": "medium",
    "due_date": "2026-01-15T10:00:00Z",
    "user_id": 1,
    "created_at": "2026-01-01T10:00:00Z",
    "updated_at": "2026-01-03T09:15:00Z"
  }
}
```

#### DELETE /tasks/{id}
Delete a task.

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

#### GET /tasks/stats
Get task statistics and recent activity for the authenticated user.

**Response (200):**
```json
{
  "stats": {
    "total_tasks": 25,
    "completed_tasks": 10,
    "in_progress_tasks": 8,
    "todo_tasks": 7,
    "high_priority_tasks": 5,
    "overdue_tasks": 2
  },
  "recentActivity": [
    {
      "id": 1,
      "user_id": 1,
      "action": "Created",
      "entity_type": "task",
      "entity_id": 5,
      "details": "Created new task: Complete project documentation",
      "created_at": "2026-01-03T10:00:00Z"
    }
  ]
}
```

### Admin Endpoints (Admin Role Required)

#### GET /admin/users
Get all users with pagination (admin only).

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 10)

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2026-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### GET /admin/users/{id}
Get a specific user by ID (admin only).

#### PATCH /admin/users/{id}
Update user role (admin only).

**Request Body:**
```json
{
  "role": "admin"
}
```

#### DELETE /admin/users/{id}
Delete a user (admin only, cannot delete self).

## Error Responses

All error responses follow a consistent format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input or validation error
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Validation Errors

Validation errors include detailed field-level feedback:

```json
{
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production using middleware or a service like Upstash Rate Limit.

## Interactive Documentation

- **Swagger UI**: Visit `/docs` for interactive API documentation
- **Postman Collection**: Import `postman_collection.json` for ready-to-use API requests

## Support

For API support or questions, contact support@example.com
