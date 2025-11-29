---
applyTo: '**'
---

# Project: PlacePro TIET  
A full-stack placement and internship management system for Thapar Institute of Engineering & Technology.

This project includes a **Node.js + Express + Prisma backend** and a **React + Vite frontend**.  
The system supports role-based authentication for **Students**, **Recruiters**, and **Placement Cell Admin**.

AI assistant must follow these instructions when generating code, answering questions, or reviewing changes.

---

# 🎯 OVERALL GOALS  
- Maintain clear separation of **backend** and **frontend**.  
- Ensure all code follows **role-based authorization** rules.  
- Keep the project simple enough for a single developer to maintain.  
- Follow the data flow and behavior defined in SRS, DFDs, and Use Case diagrams.

---

# 📌 TECH STACK  
### Backend  
- Node.js  
- Express  
- Prisma ORM  
- SQLite (local) / PostgreSQL (production-ready)  
- JWT Authentication  
- Multer (for file uploads)

### Frontend  
- React (Vite)  
- React Router  
- Axios for API calls  

---

# 📐 CODING GUIDELINES  
### 1. **Follow REST conventions.**  
Endpoints should be clean, predictable, and based on resources:
- `/api/auth/login`
- `/api/jobs`
- `/api/jobs/:id/apply`
- `/api/applications/:id/status`
- `/api/offers/:id/respond`

### 2. **Never break role rules.**
- Students can only apply to jobs, upload resume, view job listings, track status.
- Recruiters can only create jobs, view applicants, shortlist/reject, create offers.
- Placement Cell can only approve jobs, create recruiter accounts, view final placement data.

### 3. **Backend code should always include:**
- Try/catch blocks  
- Validation  
- Prisma queries  
- Proper HTTP error codes (400, 401, 403, 404, 500)

### 4. **Frontend code should:**
- Use Axios through a shared `services/auth.js` file.  
- Store JWT in `localStorage`.  
- Use Protected Routes (`PrivateRoute.jsx`).  
- NOT hardcode user roles.  
- Use simple, minimal UI.

### 5. **Never modify database structure without updating Prisma schema + migration.**

### 6. **When generating code, always show file paths.**  
Example:
