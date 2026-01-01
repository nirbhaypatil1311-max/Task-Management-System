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

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: Server Actions + SWR
- **Forms**: React Hook Form (optional)

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MySQL 8.0+
- **ORM**: None (raw SQL queries)
- **Authentication**: JWT (jose library)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **Formatting**: Prettier (optional)

## Prerequisites

- Node.js 18.x or higher
- MySQL 8.0 or higher
- npm, yarn, or pnpm

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=taskmanager

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=development
```

**Security Note**: Generate a strong JWT secret using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Database Setup

#### Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE taskmanager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskmanager;
```

#### Run Migration Scripts

Execute the SQL scripts in order:

```bash
mysql -u root -p taskmanager < scripts/01-create-tables.sql
mysql -u root -p taskmanager < scripts/02-seed-data.sql
mysql -u root -p taskmanager < scripts/03-add-admin-user.sql
```

**Note**: Update script 03 with a properly hashed admin password. Generate one using:

```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('Admin@123', 10);
console.log(hash);
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
task-management-system/
├── app/
│   ├── actions/              # Server actions
│   │   ├── auth.ts
│   │   └── tasks.ts
│   ├── api/                  # API routes
│   │   └── v1/
│   │       ├── auth/
│   │       ├── tasks/
│   │       └── admin/
│   ├── dashboard/            # Dashboard pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── tasks/
│   │   ├── profile/
│   │   └── settings/
│   ├── docs/                 # API documentation page
│   ├── login/
│   ├── signup/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/               # Reusable components
│   ├── ui/                   # shadcn/ui components
│   └── dashboard-sidebar.tsx
├── lib/                      # Utilities and helpers
│   ├── auth.ts              # Authentication utilities
│   ├── db.ts                # Database connection
│   └── schemas.ts           # Zod validation schemas
├── scripts/                  # Database migration scripts
│   ├── 01-create-tables.sql
│   ├── 02-seed-data.sql
│   └── 03-add-admin-user.sql
├── public/
│   ├── openapi.json         # OpenAPI specification
│   └── ...
├── proxy.ts                 # Middleware for route protection
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postman_collection.json  # Postman API collection
├── DATABASE_SETUP.md        # Database setup guide
├── API_DOCUMENTATION.md     # API reference
├── SCALABILITY.md           # Scalability considerations
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Tasks
- `GET /api/v1/tasks` - List all tasks (with pagination & filters)
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:id` - Get task by ID
- `PATCH /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/stats` - Get task statistics

### Admin (Admin Role Required)
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/users/:id` - Get user by ID
- `PATCH /api/v1/admin/users/:id` - Update user role
- `DELETE /api/v1/admin/users/:id` - Delete user

**Full API Documentation**: Visit [http://localhost:3000/docs](http://localhost:3000/docs) or see `API_DOCUMENTATION.md`

## Usage

### Default Credentials

After running the seed scripts:

**Regular User:**
- Email: `user@example.com`
- Password: `User@123`

**Admin User:**
- Email: `admin@example.com`
- Password: `Admin@123`

### Creating Your First Task

1. Login with user credentials
2. Navigate to Dashboard > Tasks
3. Click "Create Task"
4. Fill in task details and submit
5. View, edit, or delete tasks from the task list

### Admin Functions

1. Login with admin credentials
2. Access admin routes at `/api/v1/admin/*`
3. Use Postman or the API directly to manage users

## Testing

### Manual Testing with Postman

1. Import `postman_collection.json` into Postman
2. Set the `baseUrl` variable to `http://localhost:3000/api/v1`
3. Test authentication endpoints first
4. Use the session cookie for protected routes

### Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"User@123"}' \
  -c cookies.txt
```

**Get Tasks:**
```bash
curl http://localhost:3000/api/v1/tasks \
  -b cookies.txt
```

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Configure MySQL database (use PlanetScale, Railway, or AWS RDS)
5. Deploy

### Docker Deployment

```bash
# Build the image
docker build -t task-management .

# Run the container
docker run -p 3000:3000 --env-file .env.local task-management
```

### Environment Configuration

For production deployment:
- Use a managed MySQL service (PlanetScale, AWS RDS, Azure MySQL)
- Generate a strong JWT secret
- Enable HTTPS for secure cookies
- Set `NODE_ENV=production`
- Configure CORS if needed
- Set up monitoring and logging

## Scalability

This application is designed with scalability in mind. See `SCALABILITY.md` for detailed information on:

- Horizontal scaling strategies
- Database optimization and indexing
- Caching with Redis
- Load balancing
- Microservices architecture
- API rate limiting
- CDN integration
- Monitoring and observability

## Security Best Practices

- JWT tokens stored in HTTP-only cookies
- Passwords hashed with bcrypt (10 rounds)
- Input validation with Zod schemas
- SQL injection prevention with parameterized queries
- CSRF protection with SameSite cookies
- Role-based access control (RBAC)
- Secure environment variable management

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See `LICENSE` file for details.

## Support

For questions or issues:
- Open an issue on GitHub
- Email: support@example.com
- Documentation: `/docs` endpoint

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- API documentation with [Swagger UI](https://swagger.io/tools/swagger-ui/)

---

**Happy Task Managing!**
