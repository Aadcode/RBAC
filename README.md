
# Role-Based Access Control (RBAC)

A robust **Role-Based Access Control (RBAC)** system built with Node.js, Express.js, and MongoDB. This project implements granular user roles to ensure secure and efficient task management while restricting access based on user roles. Perfect for learning or deploying in small to medium-scale projects.

## Features

- **User Authentication:** Secure login with role-based session management.
- **Role Management:** Supports four roles: `Admin`, `Manager`, `Employee`, and `Viewer`.
- **Task Management:** Create, assign, update, delete, and view tasks based on user permissions.
- **Default Role:** New users are assigned the `Viewer` role by default.
- **Granular Permissions:**
  - **Admin:** Full access (manage users, tasks, and roles).
  - **Manager:** Create, delete, update, and assign tasks.
  - **Employee:** Update task statuses.
  - **Viewer:** View tasks only.

## Roles and Permissions

| Role       | Permissions                                                                 |
|------------|-----------------------------------------------------------------------------|
| **Admin**  | Manage users (delete, view), manage tasks (create, delete, update, assign). |
| **Manager**| Manage tasks (create, delete, update, assign).                              |
| **Employee**| Update task status.                                                       |
| **Viewer** | View tasks only.                                                           |

## Demo Users

You can use these demo accounts to explore the application:

1. **Admin**
   - Email: `alice@gmail.com`
   - Password: `alice@123`

2. **Manager**
   - Email: `bob@gmail.com`
   - Password: `bob@123`

3. **Employee**
   - Email: `john@gmail.com`
   - Password: `john`

## API Endpoints

### User Management

- **Register New User:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login`
- **View Users (Admin Only):** `GET /api/users`
- **Delete User (Admin Only):** `DELETE /api/users/:id`

### Task Management

- **Create Task (Manager/Admin):** `POST /api/tasks`
- **View Tasks (All Roles):** `GET /api/tasks`
- **Update Task (Manager/Admin):** `PUT /api/tasks/:id`
- **Delete Task (Manager/Admin):** `DELETE /api/tasks/:id`
- **Update Task Status (Employee):** `PATCH /api/tasks/:id/status`

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Authorization:** Custom middleware for role-based access control.

