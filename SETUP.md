# Project Setup Guide

This guide will help you get the **DevSync Task Management System** up and running on your local machine.

## Prerequisites

- **Node.js**: v18.17.0 or later
- **MySQL**: v8.0 or later (locally installed or via Docker)
- **NPM** or **PNPM**

## Step 1: Install Dependencies

Run the following command in the root directory:

```bash
npm install
```

## Step 2: Environment Configuration

Create a `.env` file in the root directory and add the following variables. Replace the placeholders with your actual MySQL credentials:

```env
# Database Configuration
DATABASE_URL=mysql://user:password@localhost:3306/devsync

# JWT Configuration (Use a strong random string)
JWT_SECRET=your_super_secure_jwt_secret_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Database Initialization

1. Open your MySQL client (e.g., MySQL Workbench, Beekeeper, or terminal).
2. Create a new database named `devsync`.
3. Execute the SQL scripts located in the `/scripts` folder in the following order:
   - `scripts/01-create-tables.sql` (Creates the core schema)
   - `scripts/02-seed-data.sql` (Adds sample tasks)
   - `scripts/03-add-admin-user.sql` (Adds the default admin account)

## Step 4: Run the Project

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Default Accounts

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@devsync.com | admin123 |
| User  | user@devsync.com  | user123  |

## API Documentation

Once the project is running, you can access the interactive Swagger documentation at `/docs`.
