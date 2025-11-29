# PlacePro - Placement Management System

## Prerequisites
- **Node.js** (v18 or higher)
- **Git**
- **VS Code** (recommended)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd placeme
```

### 2. Backend Setup
Open a terminal and navigate to the backend folder:
```bash
cd backend
```

**Install Dependencies:**
```bash
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend` folder with the following content:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="supersecretkey123"
PORT=4000
```

**Database Setup:**
Initialize the database and seed the admin account:
```bash
npx prisma db push
npm run seed
```
*Note: This creates a `dev.db` file and creates the default admin user.*

**Start Backend Server:**
```bash
npm run dev
```
The backend should now be running on `http://localhost:4000`.

### 3. Frontend Setup
Open a **new** terminal (keep the backend running) and navigate to the frontend folder:
```bash
cd frontend
```

**Install Dependencies:**
```bash
npm install
```

**Start Frontend Server:**
```bash
npm run dev
```
The application will be accessible at the URL shown (usually `http://localhost:5173`).

## Default Login Credentials
**Placement Cell (Admin):**
- **Email:** `placement@tiet.edu`
- **Password:** `Admin@123`

**Recruiter:**
- Create a new account via "Sign Up" (or ask Admin to create one).

**Student:**
- Sign up via the "Sign Up" page.

## Troubleshooting
- **"Unknown argument" error**: Run `npx prisma generate` in the backend folder.
- **Port already in use**: If port 4000 or 5173 is busy, the app will try the next available port. Check the terminal output.


## To open Prisma Studio 

- Navigate to backend folder and run `npx prisma studio`
