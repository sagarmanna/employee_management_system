# Employee Management System

A full-stack Employee Management System built with React, Express, Sequelize, MySQL, and JWT authentication.

## Features

- Login and registration
- Role-based access: first registered user is `admin`, later users are `user`
- Protected dashboard
- Add, edit, delete, and search employees
- Soft delete for employees
- Dashboard stats from real database records
- Profile page with profile image upload
- Dark mode
- Export employee data to Excel-compatible `.xls`

## Project Structure

```text
employee-management-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .gitignore
└── README.md
```

## Requirements

- Node.js
- npm
- MySQL database

## Backend Setup

1. Open the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file inside `backend/`:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=employee_management
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret
```

4. Create the MySQL database:

```sql
CREATE DATABASE employee_management;
```

5. Start the backend:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

## Frontend Setup

1. Open the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Optional: create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Login Notes

- Register the first account first.
- The first registered account automatically becomes `admin`.
- Admin users can add, edit, and delete employees.
- Normal users can view employee data but cannot modify it.

## Useful Commands

Backend:

```bash
npm start
npm run dev
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Deployment Environment Variables

Backend hosting needs:

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
```

Frontend hosting needs:

```env
VITE_API_URL=https://your-backend-url.com/api
```

## Deployment Order

1. Deploy MySQL database.
2. Deploy backend API.
3. Deploy frontend and set `VITE_API_URL` to the backend API URL.
